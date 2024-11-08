<?php
require '../../../headers.php';
require '../../../utils/general.php';
require '../../../utils/constants.php';

if (METHOD === 'GET') {
    require_once '../../../database.php';
    $contract_id = intval($DB->real_escape_string($_GET['contract_id']));

    $query = "SELECT due_date,start_date,end_date,currency FROM property_contracts WHERE id = $contract_id";
    $contract_data = $DB->query($query)->fetch_object();

    $contract_start_date_time = new DateTime($contract_data->start_date);
    $due_date_day = intval($contract_data->due_date) < 10 ? '0'.$contract_data->due_date : $contract_data->due_date;
    $contract_due_date_time = new DateTime($contract_start_date_time->format("Y-m")."-".$due_date_day);

    //TOTAL MONTHS
    $contract_total_months = getTotalMonths($contract_data->start_date, $contract_data->end_date);

    $months = [];
    $month_date_time = $contract_start_date_time;

    //START DATE WITH DUE DATA FIX
    if ($contract_due_date_time < $month_date_time) {
        $month_date_time->modify('+1 month');
    }

    for ($i = 0; $i <= $contract_total_months; $i++) {
        if ($month_date_time <= $NOW->time) {
            $month = new stdClass();
            $month->due_date = addTMZero($month_date_time->format("Y-m")."-".$due_date_day);

            $due_date_time = new DateTime($month->due_date);

            $overdue_date_limit_date = date('Y-m-d', strtotime($month->due_date.' + 5 days'));
            $overdue_date_time = new DateTime($overdue_date_limit_date);
            
            $date = new stdClass();
            $date->year = $month_date_time->format("Y");
            $date->month = $month_date_time->format("n");
            $date->year_month = $month_date_time->format("Y-m");
            $month->date = $date;

            $month->total_amount = 0;
            $month->is_current = $NOW->time->format("Y-m") === $month_date_time->format("Y-m")? true : false;

            //RECURRING PAYMENTS
            $query = "SELECT crp.id,crp.label,crp.value,crp.start_date,crp.end_date FROM contracts_recurring_payments AS crp WHERE crp.contract = $contract_id AND ('$date->year_month' BETWEEN DATE_FORMAT(start_date,'%Y-%m') AND DATE_FORMAT(end_date,'%Y-%m'))";
            $req_paymnts_query = $DB->query($query);
            $month->query = $query;
            $month->recurring_payments = [];
            $month->required_amount = 0;
            $month->total_recurring_amount = 0;
            if ($req_paymnts_query && $req_paymnts_query->num_rows > 0) {
                while($row = $req_paymnts_query->fetch_object()) {
                    $month->required_amount += $row->value;
                    $row->currency = $contract_data->currency;
                    array_push($month->recurring_payments, $row);
                }
            }
            
            //MONTH PAYMENTS
            $query = "SELECT cp.id,cp.amount,cp.contract,JSON_OBJECT('id',cp.recurring,'label',crp.label) AS recurring,JSON_OBJECT('id',cp.type,'label',pt.label) AS type,cp.date,cp.clarifications FROM contracts_payments AS cp LEFT JOIN contracts_recurring_payments AS crp ON crp.id = cp.recurring LEFT JOIN payments_types AS pt on pt.id = cp.type WHERE MONTH(date) = $date->month AND YEAR(date) = $date->year AND cp.contract = $contract_id";
            $payments_query = $DB->query($query);

            $month->payments = [];
            $month->payquery= $query;
            if ($payments_query && $payments_query->num_rows > 0) {
                while($row = $payments_query->fetch_object()) {
                    $type = json_decode($row->type);
                    if ($type->{'id'} == 1) {
                        $month->total_recurring_amount += $row->amount;
                    }
                    $month->total_amount += $row->amount;
                    $row->recurring = json_decode($row->recurring, true);
                    $row->type = json_decode($row->type, true);
                    $row->date = addTMZero($row->date);
                    array_push($month->payments, $row);
                };
            }

            $rent_is_due = ($NOW->time > $due_date_time) ? true : false;
            $rent_is_overdue = ($NOW->time > $overdue_date_time) ? true : false;
            
            $month_status = new stdClass();
            $month_status->label = PAYMENT_STATUS_LABEL[0];
            $month_status->severity = SEVERITY[0];
            if ($rent_is_due) {
                if ($month->total_recurring_amount < $month->required_amount) {
                    $month_status->label = PAYMENT_STATUS_LABEL[1];
                    if ($rent_is_overdue) {
                        $month_status->severity = SEVERITY[2];
                    } else {
                        $month_status->severity = SEVERITY[1];
                    };
                };
            };
            $month->status = $month_status;
            
            array_push($months, $month);
            $month_date_time->modify('+1 month');
        }
    }
    
    throwSuccess($months);
    $DB->close();
}
?>