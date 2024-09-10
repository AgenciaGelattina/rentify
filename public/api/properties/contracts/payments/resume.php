<?php
require '../../../headers.php';
require '../../../utils/general.php';
require '../../../utils/constants.php';

if (METHOD === 'GET') {
    require '../../../database.php';
    require '../../../utils/today.php';

    $query = "SELECT pc.id,pc.due_date,pc.start_date,pc.end_date,pr.id AS property_id,pr.title,pr.description,pr.group,pg.title AS group_title,pr.type,pt.label AS type_label,pr.status,st.label AS status_label ";
    $query .= "FROM property_contracts AS pc ";
    $query .= "LEFT JOIN properties AS pr ON pr.id = pc.property ";
    $query .= "LEFT JOIN properties_types AS pt ON pt.id = pr.type ";
    $query .= "LEFT JOIN properties_status AS st ON st.id = pr.status ";
    $query .= "LEFT JOIN properties_groups AS pg ON pg.id = pr.group ";
    $query .= "WHERE pc.active = 1 AND pr.active = 1 ORDER BY pc.end_date ASC";

    $group = isset($_GET['group']) ? intval($DB->real_escape_string($_GET['group'])) : 0;
    if ($group > 0) {
        $query .= " AND pr.group =".$group;
    }

    $contracts = $DB->query($query);
    
    if ($contracts && $contracts->num_rows > 0) {
        $resume_data=[];
        while($row = $contracts->fetch_object()){

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
            $rent_is_due = ($today->time > $due_date_time) ? true : false;
            $rent_is_overdue = ($today->time > $overdue_date_time) ? true : false;
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

            // PROPERTY
            $property = new stdClass();
            $property->id = $row->property_id;
            $property->title = $row->title;
            $property->description = $row->description;
            $property->group = ['id'=> $row->group, 'title'=> $row->group_title];
            $property->type = ['id'=> $row->type, 'label'=> $row->type_label];
            $property->status = ['id'=> $row->status, 'label'=> $row->status_label];
            
            array_push($resume_data, ['contract'=> $contract, 'property'=> $property]);
        }
        //print_r($resume_data);
        throwSuccess($resume_data);
    } else {
        throwSuccess([]);
    }
    $DB->close();
}
?>