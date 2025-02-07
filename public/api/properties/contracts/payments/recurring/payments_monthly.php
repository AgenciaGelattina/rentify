<?php
require '../../../../headers.php';
require '../../../../utils/general.php';
require '../../../../utils/constants.php';

if (METHOD === 'GET') {
    require_once '../../../../database.php';
    $contract_id = intval($DB->real_escape_string($_GET['contract_id']));

    $query = "SELECT due_date,start_date,end_date,in_date,currency FROM property_contracts WHERE id = $contract_id";
    $contract_data = $DB->query($query)->fetch_object();

    $contract_start_date_time = new DateTime($contract_data->start_date);
    $contract_end_date_time = new DateTime($contract_data->end_date);
    $contract_in_date_time = new DateTime($contract_data->in_date);
    $due_date_day = checkDueDateDay($contract_data->due_date);
    $contract_due_date_time = new DateTime($contract_start_date_time->format("Y-m")."-".$due_date_day);

    //TOTAL MONTHS
    $contract_total_months = getTotalMonths($contract_data->start_date, $contract_data->end_date);

    $months = [];
    $month_date_time = $contract_in_date_time;

    //START DATE WITH DUE DATA FIX
    if ($contract_due_date_time < $month_date_time) {
        $month_date_time->modify('+1 month');
    };
    
    for ($i = 0; $i <= $contract_total_months; $i++) {
        $month = new stdClass();
        $month->due_date = addTMZero($month_date_time->format("Y-m")."-".$due_date_day);

        $due_date_time = new DateTime($month->due_date);
        //if ($month_date_time < $NOW->time) {
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
            $query = "SELECT crch.id,crch.label,crch.value,crch.start_date,crch.end_date FROM contracts_recurring_charges AS crch WHERE crch.contract = $contract_id AND ('$date->year_month' BETWEEN DATE_FORMAT(start_date,'%Y-%m') AND DATE_FORMAT(end_date,'%Y-%m'))";
            $rec_charges_query = $DB->query($query);
            $month->recurring_charges = [];
            $month->required_amount = 0;
            $month->total_charge_amount = 0;
            if ($rec_charges_query && $rec_charges_query->num_rows > 0) {
                while($row = $rec_charges_query->fetch_object()) {
                    $month->required_amount += $row->value;
                    $row->currency = $contract_data->currency;
                    array_push($month->recurring_charges, $row);
                }
            }
            
            //MONTH PAYMENTS
            $query = "SELECT cp.id,cp.amount,cp.contract,IF(cp.recurring > 0, JSON_OBJECT('id',cp.recurring,'label',crch.label), NULL) AS recurring,cp.date,cp.clarifications FROM contracts_payments AS cp LEFT JOIN contracts_recurring_charges AS crch ON crch.id = cp.recurring WHERE MONTH(date) = $date->month AND YEAR(date) = $date->year AND cp.contract = $contract_id";
            $payments_query = $DB->query($query);

            $month->payments = [];
            $month->payquery= $query;
            if ($payments_query && $payments_query->num_rows > 0) {
                while($row = $payments_query->fetch_object()) {
                    if(is_null($row->recurring)) {
                        $row->type = "extraordinary";
                    } else {
                        $month->total_charge_amount += $row->amount;
                        $row->recurring = json_decode($row->recurring, true);
                        $row->type = "monthly";
                    }
                    $month->total_amount += $row->amount;
                    $row->date = addTMZero($row->date);
                    array_push($month->payments, $row);
                };
            }

            $rent_is_due = ($NOW->time > $due_date_time) ? true : false;
            $rent_is_overdue = ($NOW->time > $overdue_date_time) ? true : false;
            
            $month_status = new stdClass();
            $month_status->label = PAYMENT_STATUS_LABEL[0];
            $month_status->severity = SEVERITY[3];
            if ($rent_is_due) {
                if ($month->total_charge_amount < $month->required_amount) {
                    $month_status->label = PAYMENT_STATUS_LABEL[1];
                    if ($rent_is_overdue) {
                        $month_status->severity = SEVERITY[2];
                    } else {
                        $month_status->severity = SEVERITY[1];
                    };
                } else {
                    $month_status->severity = SEVERITY[0];
                }
            };
            $month->status = $month_status;
            
            array_push($months, $month);
            //if ($month_date_time < $contract_end_date_time) {
                $month_date_time->modify('+1 month');
            //}
        //}
    }
    
    throwSuccess($months);
    $DB->close();
}
?>