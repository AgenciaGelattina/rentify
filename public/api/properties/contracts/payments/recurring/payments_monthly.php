<?php
require '../../../../headers.php';
require '../../../../utils/general.php';
require '../../../../utils/constants.php';

if (METHOD === 'GET') {
    require_once '../../../../database.php';
    $contract_id = intval($DB->real_escape_string($_GET['contract_id']));

    $query = "SELECT id,due_date,start_date,end_date,in_date,currency FROM property_contracts WHERE id = $contract_id";
    $contract_data = $DB->query($query)->fetch_object();

    $contract_start_date_time = new DateTime($contract_data->start_date);
    $contract_end_date_time = new DateTime($contract_data->end_date);
    $contract_in_date_time = new DateTime($contract_data->in_date);
    $due_date_day = addZero($contract_data->due_date);

    //validate date
    $due_date_string = validateDueDate($contract_start_date_time, $due_date_day);
    $contract_due_date_time = new DateTime($due_date_string);

    //TOTAL MONTHS
    $contract_total_months = getTotalMonths($contract_data->start_date, $contract_data->end_date);

    $months = [];
    $month_date_time = $contract_in_date_time;

    //START DATE WITH DUE DATE FIX
    if ($contract_due_date_time < $month_date_time) {
        $month_date_time->modify('+1 month');
        $contract_total_months = $contract_total_months - 1;
    };
    
    for ($i = 0; $i <= $contract_total_months; $i++) {
        $month = new stdClass();
        $month->due_date = addTMZero(validateDueDate($month_date_time, $due_date_day));

        $due_date_time = new DateTime($month->due_date);
        $rent_is_due = ($NOW->time > $due_date_time) ? true : false;

        if ($due_date_time < $contract_end_date_time) {
           
            $overdue_date_limit_date = date('Y-m-d', strtotime($month->due_date.' + 5 days'));
            $overdue_date_time = new DateTime($overdue_date_limit_date);
            
            $date = new stdClass();
            $date->year = $month_date_time->format("Y");
            $date->month = $month_date_time->format("n");
            $date->year_month = $month_date_time->format("Y-m");
            $month->date = $date;

            $month->total_amount = 0;
            $month->is_current = $NOW->time->format("Y-m") === $month_date_time->format("Y-m")? true : false;

            //RECURRING CHARGES
            $query = "SELECT crch.id,crch.label,crch.value,crch.start_date,crch.end_date,IFNULL((SELECT SUM(cp.amount) FROM contracts_payments AS cp WHERE cp.contract = $contract_id AND recurring = crch.id AND $date->year = YEAR(cp.date) AND $date->month = MONTH(cp.date)),0) AS total_amount FROM contracts_recurring_charges AS crch WHERE crch.contract = $contract_id AND crch.canceled = 0 AND ('$date->year_month' BETWEEN DATE_FORMAT(crch.start_date,'%Y-%m') AND DATE_FORMAT(crch.end_date,'%Y-%m'))";
            $rec_charges_query = $DB->query($query);
            $month->recurring_charges = [];
            $month->required_amount = 0;
            $month->total_charge_amount = 0;
            if ($rec_charges_query && $rec_charges_query->num_rows > 0) {
                while($rec = $rec_charges_query->fetch_object()) {
                    $month->required_amount += $rec->value;

                    $recurring_charge = new stdClass();
                    $recurring_charge->id = $rec->id;
                    $recurring_charge->contract = $contract_data->id;
                    $recurring_charge->label = $rec->label;
                    $recurring_charge->value = $rec->value;
                    $recurring_charge->currency = $contract_data->currency;
                    $recurring_charge->canceled = false;
                    $recurring_charge->start_date = addTMZero($rec->start_date);
                    //$rec_start_date_time = new DateTime($recurring_charge->start_date);
                    $recurring_charge->end_date = addTMZero($rec->end_date);
                    $rec_end_date_time = new DateTime($recurring_charge->end_date);
                    $recurring_charge->expired = ($NOW->time > $rec_end_date_time) ? true : false;

                    //STATEMENTS
                    $rec_statements = new stdClass();
                    $rec_statements->required_amount = $rec->value;
                    $rec_statements->total_amount = $rec->total_amount;
                    $rec_statements->pending_payments = ($rec->total_amount < $rec->value) ? true : false;
                    $rec_statements->pending_amount = $rec_statements->pending_payments ? abs($rec_statements->total_amount - $rec_statements->required_amount) : 0;

                    // PAYMENT LIST
                    $payments_query = "SELECT cp.id,cp.contract,cp.recurring,cp.amount,cp.date,cp.clarifications,cp.confirmed FROM contracts_payments AS cp WHERE cp.recurring = $recurring_charge->id AND $date->year = YEAR(cp.date) AND $date->month = MONTH(cp.date)";

                    $rec_payments = $DB->query($payments_query);

                    $payment_data = new stdClass();
                    $payment_data->payments = [];
                    $payment_data->total_amount = 0;
                    while($pmnt = $rec_payments->fetch_object()) {
                        $payment = new stdClass();
                        $payment = $pmnt;
                        $pmnt->currency = $recurring_charge->currency;
                        $payment_data->total_amount = $payment_data->total_amount + $payment->amount;
                        $payment->confirmed = $pmnt->confirmed === 0 ? false : true;
                        array_push($payment_data->payments, $payment);
                    };
                    $payment_data->pending_amount = $payment_data->total_amount - $recurring_charge->value;
                    $recurring_charge->payments = $payment_data;

                    $rec_status = new stdClass();
                    $rec_status->label = PAYMENT_STATUS_LABEL[2];
                    $rec_status->severity = SEVERITY[3];

                    if ($rent_is_due || $recurring_charge->expired) {
                        if ($rec_statements->pending_payments) {
                            $rec_status->label = PAYMENT_STATUS_LABEL[1];
                            $rec_status->severity = SEVERITY[1];
                            if ($rent_is_overdue) {
                                $rec_status->severity = SEVERITY[2];
                            };
                        } else {
                            $rec_status->label = PAYMENT_STATUS_LABEL[0];
                            $rec_status->severity = SEVERITY[0];
                        };
                    };

                    $recurring_charge->status = $rec_status;
                    $recurring_charge->statements =  $rec_statements;
                    
                    array_push($month->recurring_charges, $recurring_charge);
                }
            };
        
            //MONTH PAYMENTS
            $query = "SELECT cp.id,cp.amount,cp.contract,IF(cp.recurring > 0, JSON_OBJECT('id',cp.recurring,'label',crch.label), NULL) AS recurring,cp.date,cp.clarifications,cp.confirmed FROM contracts_payments AS cp LEFT JOIN contracts_recurring_charges AS crch ON crch.id = cp.recurring WHERE MONTH(date) = $date->month AND YEAR(date) = $date->year AND cp.contract = $contract_id";
            $payments_query = $DB->query($query);

            $month->payments = [];
            //$month->payquery= $query;
            if ($payments_query && $payments_query->num_rows > 0) {
                while($row = $payments_query->fetch_object()) {
                    if(is_null($row->recurring)) {
                        $row->type = "extraordinary";
                    } else {
                        if ($row->confirmed == 1) {
                            $month->total_charge_amount += $row->amount;
                        }
                        $row->recurring = json_decode($row->recurring, true);
                        $row->type = "monthly";
                    }
                    if ($row->confirmed == 1) {
                        $month->total_amount += $row->amount;
                    }
                    $row->date = addTMZero($row->date);
                    $row->confirmed = $row->confirmed == 1 ? true : false;
                    array_push($month->payments, $row);
                };
            };

            $rent_is_due = ($NOW->time > $due_date_time) ? true : false;
            $rent_is_overdue = ($NOW->time > $overdue_date_time) ? true : false;
            
            $month_status = new stdClass();
            $month_status->label = PAYMENT_STATUS_LABEL[0];
            $month_status->severity = SEVERITY[3];
            $payment_incomplete = count($month->payments) === 0 || $month->total_charge_amount < $month->required_amount;
            if ($rent_is_due) {
                if ($payment_incomplete) {
                    $month_status->label = PAYMENT_STATUS_LABEL[1];
                    if ($rent_is_overdue) {
                        $month_status->severity = SEVERITY[2];
                    } else {
                        $month_status->severity = SEVERITY[1];
                    };
                } else {
                    $month_status->severity = SEVERITY[0];
                }
            } else if (!$payment_incomplete) {
                $month_status->severity = SEVERITY[0];
            };
            $month->status = $month_status;
            
            array_push($months, $month);
            if ($month_date_time < $contract_end_date_time) {
                $month_date_time->modify('+1 month');
            }
        }
    }
    
    throwSuccess($months);
    $DB->close();
}
?>