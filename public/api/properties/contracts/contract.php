<?php
require '../../headers.php';
require '../../utils/general.php';
require '../../utils/constants.php';
require '../../database.php';

if (METHOD === 'GET') {
    
    $status = $DB->real_escape_string($_GET['status']);
    $query = "SELECT id,property,due_date,start_date,end_date,in_date,out_date,currency,canceled,finalized FROM property_contracts";

    if ($status === "current") {
        $property = intval($DB->real_escape_string($_GET['property_id']));
        $query .= " WHERE property = $property AND canceled = 0 AND finalized = 0 AND end_date >= CURDATE()";
    }
    if ($status === "data") {
        $contract = intval($DB->real_escape_string($_GET['contract_id']));
        $query .= " WHERE id = $contract";
    }
    
    $contract_result = $DB->query($query);
    
    if ($contract_result->num_rows > 0) {
        $row = $contract_result->fetch_object();

        // CONTRACT
        $contract = new stdClass();
        $contract->id = $row->id;
        $contract->currency = $row->currency;

        $contract->start_date = addTMZero($row->start_date);
        $contract_start_date_time = new DateTime($row->start_date);
        $contract->end_date = addTMZero($row->end_date);
        $contract_end_date_time = new DateTime($row->end_date);

        $contract->in_date = addTMZero($row->in_date);
        //$contract_in_date_time = new DateTime($row->in_date);
        $contract->out_date = addTMZero($row->out_date);
        //$contract_out_date_time = new DateTime($row->out_date);

        $contract->expired = ($NOW->time > $contract_end_date_time) ? true : false;
        $contract->canceled = $row->canceled == 0 ? false : true;
        $contract->finalized = $row->finalized == 0 ? false : true;

        //DUE DATE
        $due_date_day = intval($row->due_date) < 10 ? '0'.$row->due_date : $row->due_date;

        $due_date_date = date("Y-m-".$due_date_day);
        $due_date_time = new DateTime($due_date_date);

        if ($contract->expired) {
            $due_date_date = $contract_end_date_time->format("Y-m-d");
        } else if ($contract_start_date_time > $due_date_time) {
            $due_date_time->modify('+1 month');
            $due_date_date = $due_date_time->format('Y-m-d');
        }

        $due_date_time = new DateTime($due_date_date);
        $overdue_date_limit_date = date('Y-m-d', strtotime($due_date_date. ' + 5 days'));
        $overdue_date_time = new DateTime($overdue_date_limit_date);
        
        $contract_due_date = new stdClass();
        $contract_due_date->day = $row->due_date;
        $contract_due_date->start = addTMZero($due_date_date);
        $contract_due_date->end = addTMZero($overdue_date_limit_date);
        $contract->due_date = $contract_due_date;

        //TOTAL MONTHS
        $contract_total_months = getTotalMonths($contract->start_date, $contract->end_date);
        $contract->total_months = $contract_total_months;

        //RENT DUE
        $rent_is_due = ($NOW->time > $due_date_time) ? true : false;
        $rent_is_overdue = ($NOW->time > $overdue_date_time) ? true : false;

        // RECURRING PAYMENTS
        $query = "SELECT crp.id,crp.label,crp.value,crp.start_date,crp.end_date,crp.canceled,";
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
            $recurring_payment->currency = $contract->currency;
            $recurring_payment->canceled = $rec->canceled ? true : false;
            $recurring_payment->start_date = addTMZero($rec->start_date);
            //$rec_start_date_time = new DateTime($recurring_payment->start_date);
            $recurring_payment->end_date = addTMZero($rec->end_date);
            $rec_end_date_time = new DateTime($recurring_payment->end_date);
            $recurring_payment->expired = ($NOW->time > $rec_end_date_time)? true : false;
            
            //TOTAL MONTHS
            $recurring_payment->total_months = getTotalMonths($recurring_payment->start_date,$recurring_payment->end_date);
            
            //CURRENT MONTH
            $recurring_payment->current_month = getTotalMonths($recurring_payment->start_date,$NOW->date);

            //STATUS
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
            if ($recurring_payment->expired) {
                $due_date_date = $rec_end_date_time->format("Y-m-d");
                $overdue_date_limit_date = $rec_end_date_time->format("Y-m-d");
            } else {
                $due_date_date = date("Y-m-".$due_date_day);
                $overdue_date_limit_date = date('Y-m-d', strtotime($due_date_date. ' + 5 days'));
            }
            $rec_due_date->start = addTMZero($due_date_date);
            $rec_due_date->end = addTMZero($overdue_date_limit_date);
            $recurring_payment->due_date = $rec_due_date;

            //OVERDUE
            $rec_due_date->is_overdue = ($NOW->time > new DateTime($due_date_date))? true : false;

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
        if ($contract_has_debts) {
            $contract_status->label = PAYMENT_STATUS_LABEL[1];
            $contract_status->severity = ($rent_is_overdue || $contract_pending_months > 0) ? SEVERITY[2] : SEVERITY[1];
        } else {
            $contract_status->label = PAYMENT_STATUS_LABEL[0];
            $contract_status->severity = SEVERITY[0];
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
    $currency = $DB->real_escape_string(POST['currency']);
    $due_date = intval($DB->real_escape_string(POST['due_date']));
    $start_date = $DB->real_escape_string(POST['start_date']);
    $end_date = $DB->real_escape_string(POST['end_date']);
    $in_date = $DB->real_escape_string(POST['in_date']);
    $out_date = $DB->real_escape_string(POST['out_date']);

    if ($id > 0) { 
        $fields = "due_date=$due_date,currency='$currency',start_date='$start_date',end_date='$end_date',in_date='$in_date',out_date='$out_date'";
        $account = $DB->query("UPDATE property_contracts SET $fields WHERE id=".$id); 
        if ($DB->affected_rows >= 0) {
            throwSuccess(true, "El contrato fue modificado.");
        } else {
            throwError(203, "Error al modificar contrato $id");
        }
    } else {
        $value = $DB->real_escape_string(POST['value']);

        $query_contract ="INSERT INTO property_contracts (`property`,`currency`,`due_date`,`start_date`,`end_date`,`in_date`,`out_date`) VALUES ($property,'$currency',$due_date,'$start_date','$end_date','$in_date','$out_date')";
        $property_result = $DB->query($query_contract);
        $newID = $DB->insert_id;
        if ($newID > 0) {
            // default recurrent payment
            $query_payment ="INSERT INTO contracts_recurring_payments (contract,label,value,start_date,end_date) VALUES ($newID,'Renta','$value','$start_date','$end_date')";
            $property_result = $DB->query($query_payment);

            // default folders
            $query_folders = "INSERT INTO contracts_folders (`name`,`contract`,`title`,`description`,`created`) VALUES ";
            $folders = [];
            foreach(POST['folders'] as $key => $folder) {
                $name = $folder['name'];
                $title = $folder['title'];
                $description = $folder['description'];
                array_push($folders, "('$name',$newID,'$title','$description',CURDATE())");
            }
            $query_folders .= implode(",", $folders);
            $folders_result = $DB->query($query_folders);

            throwSuccess(true, "El contrato con ID #$newID ha sido creado.");
        }else {
            throwError(203, "No se pudo crear el contrato");
        }
    }
    $DB->close();
}
?>