<?php
require '../../../headers.php';
require '../../../utils/general.php';
require '../../../utils/constants.php';

if (METHOD === 'GET') {
    require '../../../database.php';

    $query = "SELECT pc.id,pc.due_date,pc.currency,pc.start_date,pc.end_date,pc.in_date,pc.out_date,pc.canceled,pr.id AS property_id,pr.title,pr.description,pr.group,pg.title AS group_title,pr.type,pt.label AS type_label,pr.status,st.label AS status_label ";
    $query .= "FROM property_contracts AS pc ";
    $query .= "LEFT JOIN properties AS pr ON pr.id = pc.property ";
    $query .= "LEFT JOIN properties_types AS pt ON pt.id = pr.type ";
    $query .= "LEFT JOIN properties_status AS st ON st.id = pr.status ";
    $query .= "LEFT JOIN properties_groups AS pg ON pg.id = pr.group ";
    $query .= "WHERE pc.finalized = 0 AND pr.active = 1 ORDER BY pc.end_date ASC";

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
            $contract->currency = $row->currency;

            $contract->start_date = addTMZero($row->start_date);
            $contract_start_date_time = new DateTime($row->start_date);
            $contract->end_date = addTMZero($row->end_date);
            $contract_end_date_time = new DateTime($row->end_date);

            $contract->in_date = addTMZero($row->in_date);
            //$contract_in_date_time = new DateTime($row->in_date);
            $contract->out_date = addTMZero($row->out_date);
            //$contract_out_date_time = new DateTime($row->out_date);

            $contract->expired = ($NOW->time > $contract_end_date_time)? true : false;
            $contract->canceled = $row->canceled == 0 ? false : true;
            $contract->finalized = false;

            //OVERDUE
            $contract_is_overdue = ($NOW->time > $contract_end_date_time)? true : false;
            $contract->is_overdue = $contract_is_overdue ? true : false;

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

            //CURRENT MONTH
            $contract_current_month = getTotalMonths($contract->start_date, $NOW->last_day_month);
            if ($contract_current_month > $contract_total_months) {
                $contract_current_month = $contract_total_months;
            }

            //OVERDUE
            $rent_is_due = ($NOW->time > $due_date_time) ? true : false;
            $rent_is_overdue = ($NOW->time > $overdue_date_time) ? true : false;

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
                $recurring_payment->currency = $contract->currency;
                $recurring_payment->start_date = addTMZero($rec->start_date);
                $rec_start_date_time = new DateTime($rec->start_date);
                $recurring_payment->end_date = addTMZero($rec->end_date);
                $rec_end_date_time = new DateTime($rec->end_date);
                
                $rec_is_expired = ($NOW->time > $rec_end_date_time)? true : false;
                $recurring_payment->expired = $rec_is_overdue ? true : false;
                
                //TOTAL MONTHS
                $recurring_payment->total_months = getTotalMonths($recurring_payment->start_date, $recurring_payment->end_date);
                
                //CURRENT MONTH
                $recurring_payment->current_month = getTotalMonths($recurring_payment->start_date,$NOW->date);
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

                // DUE DATE
                $rec_due_date = new stdClass();
                $rec_due_date->day = $due_date_day;

                $rec_due_date_date = date("Y-m-".$due_date_day);
                $rec_due_date_time = new DateTime($rec_due_date_date);

                if ($recurring_payment->expired) {
                    $rec_due_date_date = $rec_end_date_time->format("Y-m-d");
                } else if ($rec_start_date_time > $rec_due_date_time) {
                    $rec_due_date_time->modify('+1 month');
                    $rec_due_date_date = $rec_due_date_time->format('Y-m-d');
                }

                $rec_due_date_time = new DateTime($rec_due_date_date);
                $rec_overdue_date_limit_date = date('Y-m-d', strtotime($rec_due_date_date. ' + 5 days'));

                $rec_due_date->start = addTMZero($rec_due_date_date);
                $rec_due_date->end = addTMZero($rec_overdue_date_limit_date);
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