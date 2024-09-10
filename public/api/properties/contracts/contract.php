<?php
require '../../headers.php';
require '../../utils/general.php';
require '../../utils/constants.php';
require '../../utils/today.php';
require '../../database.php';

if (METHOD === 'GET') {
    $property = intval($DB->real_escape_string($_GET['property_id']));
    $query = "SELECT id,property,due_date,start_date,end_date FROM property_contracts WHERE property = $property AND active = 1 AND start_date <= CURDATE() AND end_date >= CURDATE()";
    $contract_result = $DB->query($query);
    
    if ($contract_result->num_rows > 0) {
        $row = $contract_result->fetch_object();

        // CONTRACT
        $contract = new stdClass();
        $contract->id = $row->id;
        $contract->start_date = $row->start_date."T00:00:00";
        $contract_start_date_time = new DateTime($contract->start_date);
        $contract->end_date = $row->end_date."T00:00:00";
        $contract_end_date_time = new DateTime($contract->end_date);
        $contract->active = true;

        //OVERDUE
        $contract_is_overdue = ($today->time > $contract_end_date_time)? true : false;
        $contract->is_overdue = $contract_is_overdue ? true : false;

        $due_date_day = intval($row->due_date) < 10 ? '0'.$row->due_date : $row->due_date;

        if ($contract->is_overdue) {
            $due_date_date = $contract_end_date_time->format("Y-m-d");
            $overdue_date_limit_date = $contract_end_date_time->format("Y-m-d");
        } else {
            $due_date_date = date("Y-m-".$due_date_day);
            $overdue_date_limit_date = date('Y-m-d', strtotime($due_date_date. ' + 5 days'));
        }
        $due_date_time = new DateTime($due_date_date);
        $overdue_date_time = new DateTime($overdue_date_limit_date);
        
        $contract_due_date = new stdClass();
        $contract_due_date->day = $row->due_date;
        $contract_due_date->start = $due_date_date."T00:00:00";
        $contract_due_date->end = $overdue_date_limit_date."T00:00:00";
        $contract->due_date = $contract_due_date;

        //TOTAL MONTHS
        $diff = $contract_start_date_time->diff($contract_end_date_time); 
        $contract_total_months = (($diff->y) * 12) + ($diff->m) + 1;

        //CURRENT MONTH
        $rent_is_due = ($today_time > $due_date_time) ? true : false;
        $rent_is_overdue = ($today_time > $overdue_date_time) ? true : false;
        $diff = $contract_start_date_time->modify('first day of this month')->diff($today->last_day_month);
        $add_month = $rent_is_due ? 1 : 0;
        $contract_current_month = (($diff->y) * 12) + ($diff->m) + $add_month;
        if ($contract_current_month > $contract_total_months) {
            $contract_current_month = $contract_total_months;
        }

        // RECURRING PAYMENTS
        $query = "SELECT crp.id,crp.label,crp.value,crp.start_date,crp.end_date,";
        $query .= "(SELECT SUM(cp.amount) FROM contracts_payments AS cp WHERE cp.contract = crp.contract AND recurring = crp.id) AS total_amount ";
        $query .= "FROM contracts_recurring_payments AS crp WHERE crp.contract = $contract->id";
        $rec_payments = $DB->query($query);

        $recurring_payments = [];

        $contract_payment_status = new stdClass();
        $contract_payment_status->monthly_amount = 0;
        $contract_payment_status->required_amount = 0;
        $contract_payment_status->total_amount = 0;
        $contract_payment_status->pending_amount = 0;

        $contract_has_debts = false;
        while($rec = $rec_payments->fetch_object()) {
            $recurring_payment = new stdClass();
            $recurring_payment->id = $rec->id;
            $recurring_payment->label = $rec->label;
            $recurring_payment->value = $rec->value;
            $recurring_payment->start_date = $rec->start_date."T00:00:00";
            $rec_start_date_time = new DateTime($recurring_payment->start_date);
            $recurring_payment->end_date = $rec->end_date."T00:00:00";
            $rec_end_date_time = new DateTime($recurring_payment->end_date);
            
            $rec_is_overdue = ($today->time > $rec_end_date_time)? true : false;
            $recurring_payment->is_overdue = $rec_is_overdue ? true : false;
            
            //TOTAL MONTHS
            $diff = $rec_start_date_time->diff($rec_end_date_time); 
            $recurring_payment->total_months = (($diff->y) * 12) + ($diff->m) + 1;
            
            //CURRENT MONTH
            $diff = $rec_start_date_time->modify('first day of this month')->diff($today->last_day_month);
            $add_month = $rent_is_due ? 1 : 0;
            $recurring_payment->current_month = (($diff->y) * 12) + ($diff->m) + $add_month;
            if ($recurring_payment->current_month > $recurring_payment->total_months) {
                $recurring_payment->current_month = $recurring_payment->total_months;
            }

            $rec_payment_status = new stdClass();
            $rec_payment_status->required_amount = $rec->value * $recurring_payment->current_month;
            $contract_payment_status->required_amount += $rec_payment_status->required_amount;
            $rec_payment_status->total_amount = $rec->total_amount ? $rec->total_amount : 0;
            $contract_payment_status->total_amount += $rec_payment_status->total_amount;
            $rec_payment_status->pending_amount = abs($rec_payment_status->total_amount - $rec_payment_status->required_amount);
            $contract_payment_status->pending_amount += $rec_payment_status->pending_amount;
            $rec_payment_status->pending_months = ceil($rec_payment_status->pending_amount / $rec->value);
            $contract_payment_status->monthly_amount += $rec->value;

            $rec_due_date = new stdClass();
            $rec_due_date->day = $due_date_day;
            if ($recurring_payment->is_overdue) {
                $due_date_date = $rec_end_date_time->format("Y-m-d");
                $overdue_date_limit_date = $rec_end_date_time->format("Y-m-d");
            } else {
                $due_date_date = date("Y-m-".$due_date_day);
                $overdue_date_limit_date = date('Y-m-d', strtotime($due_date_date. ' + 5 days'));
            }
            $rec_due_date->start = $due_date_date."T00:00:00";
            $rec_due_date->end = $overdue_date_limit_date."T00:00:00";
            $recurring_payment->due_date = $rec_due_date;

            $rec_status = new stdClass();
            if ($rec_payment_status->pending_amount > 0) {
                $contract_has_debts = true;
                $rec_status->label = PAYMENT_STATUS_LABEL[1];
                if ($rec_payment_status->pending_months > 0 ) {
                    $rec_status->severity = SEVERITY[2];
                } else {
                    $rec_status->label = PAYMENT_STATUS_LABEL[1];
                    $rec_status->severity = $rent_is_overdue ? SEVERITY[2] : SEVERITY[1];
                }
            } else {
                $rec_status->label = PAYMENT_STATUS_LABEL[0];
                $rec_status->severity = SEVERITY[0];
            }
            $rec_payment_status->status = $rec_status;

            $recurring_payment->payment_status = $rec_payment_status;
            array_push($recurring_payments, $recurring_payment);
        }

        //CONTRACT PENDING MONTHS
        $contract_pending_months = $contract_payment_status->monthly_amount > 0 ? ceil($contract_payment_status->pending_amount / $contract_payment_status->monthly_amount) : 0;
        $contract_payment_status->pending_months = $contract_pending_months;

        //CONTRACT STATUS
        $contract_status = new stdClass();
        if ($contract->is_overdue) {
            $contract_status->label = PAYMENT_STATUS_LABEL[1];
            $contract_status->severity = SEVERITY[2];
        } else {
            if ($contract_has_debts) {
                $contract_status->label = PAYMENT_STATUS_LABEL[1];
                $contract_status->severity = ($rent_is_overdue || $contract_pending_months > 0) ? SEVERITY[2] : SEVERITY[1];
            } else {
                $contract_status->label = PAYMENT_STATUS_LABEL[0];
                $contract_status->severity = SEVERITY[0];
            }
        }
        $contract_payment_status->status = $contract_status;
        
        $contract->payment_status = $contract_payment_status;
        $contract->recurring_payments = $recurring_payments;
        
        throwSuccess($contract);
    } else {
        throwSuccess(["id"=>0]);
    }
    $DB->close();
}

if (METHOD === 'POST') {
    $id = intval($DB->real_escape_string(POST['id']));
    $property = intval($DB->real_escape_string(POST['property']));
    $value = $DB->real_escape_string(POST['value']);
    $due_date = intval($DB->real_escape_string(POST['due_date']));
    $start_date = $DB->real_escape_string(POST['start_date']);
    $end_date = $DB->real_escape_string(POST['end_date']);

    if ($id > 0) { 
        $fields = "value='$value',due_date=$due_date,start_date='$start_date',end_date='$end_date'";
        $account = $DB->query("UPDATE property_contracts SET $fields WHERE id=".$id); 
        if ($DB->affected_rows >= 0) {
            throwSuccess(true, "El contrato fue modificado.");
        } else {
            throwError(203, "Error al guardar contrato $id");
        }
    } else {
        $query_contract ="INSERT INTO property_contracts (`property`,`due_date`,`start_date`,`end_date`,`created`) VALUES ($property,$due_date,'$start_date','$end_date',CURDATE())";
        $property_result = $DB->query($query_contract);
        $newID = $DB->insert_id;
        if ($newID > 0) {
            // default recurrent payment
            $query_payment ="INSERT INTO contracts_recurring_payments (contract,label,value,start_date,end_date) VALUES ($newID,'Renta',$value,'$start_date','$end_date')";
            $property_result = $DB->query($query_payment);

            // default folders
            $query_folders = "INSERT INTO contracts_folders (`name`,`contract`,`title`,`description`,`created`) VALUES ";
            $folders = [];
            foreach(POST['folders'] as $key => $folder) {
                $name = $folder['name'];
                $title = $folder['title'];
                array_push($folders, "('$name',$newID,'$title','',CURDATE())");
            }
            $query_folders .= implode(",", $folders);
            $folders_result = $DB->query($query_folders);

            throwSuccess(true, "El contrato con ID $newID ha sido creado.");
        }else {
            throwError(203, "No se pudo crear el contrato");
        }
    }
    $DB->close();
}
?>