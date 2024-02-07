<?php
require '../../../headers.php';
require '../../../utils.php';

if (METHOD === 'GET') {
    require_once '../../../database.php';
    $contract_id = intval($DB->real_escape_string($_GET['contract_id']));
    $query = "SELECT due_date,start_date,end_date,value FROM property_contracts WHERE id = $contract_id";
    $contract = $DB->query($query)->fetch_object();
    
    $init = new DateTimeImmutable($contract->start_date);
    $start_date_time = new DateTime($init->format("Y-m"));
    $end = new DateTimeImmutable($contract->end_date);
    $end_date_time = new DateTime($end->format("Y-m"));                                  
    $months = $end_date_time->diff($start_date_time); 
    $num_of_months = (($months->y) * 12) + ($months->m);

    $months = [];
    /*
    // Si el día de corte es mayor a 15, comienza el mes entrante
    if ($contract->due_date > 15) {
        $start_date_time = $start_date_time->modify('+1 month');
    }
    */
    /**
     * in_debt
     * 0 = sin deuda
     * 1 = con deuda
     * 2 = con exceso
    */
    $today = new DateTime();
    for ($i = 0; $i <= $num_of_months; $i++) {
        $month = new stdClass();
        $date = new stdClass();
        $date->year = $start_date_time->format("Y");
        $date->month = $start_date_time->format("n");
        $date->year_month = $start_date_time->format("Y-m");
        $month->date = $date;
        $due_date = intval($contract->due_date) < 10 ? '0'.$contract->due_date : $contract->due_date;
        $month->due_date = $start_date_time->format("Y-m")."-".$due_date."T00:00:00";
        $month->payments = [];
        $month->total_amount = 0;
        $month->rent_amount = 0;
        $month->in_debt = true;
        $month->is_current = $today->format("Y-m") === $start_date_time->format("Y-m")? true : false;
        array_push($months, $month);
        $start_date_time = $start_date_time->modify('+1 month');
    }

    $query = "SELECT cp.id,cp.amount,cp.type AS type_id,pt.label AS type_label,cp.date,cp.clarifications,cp.contract FROM contracts_payments AS cp LEFT JOIN payments_types AS pt ON pt.id = cp.type WHERE cp.contract = $contract_id ORDER BY cp.date;";
    $contractors = $DB->query($query);
    while($row=$contractors->fetch_object()){
        $payment = new stdClass();
        $payment->id = $row->id;
        $payment->contract = $row->contract;
        $payment->amount = $row->amount;
        $payment_date = new DateTime($row->date);
        $payment->date = $row->date."T00:00:00";
        $type = new stdClass();
        $type->id = intval($row->type_id);
        $type->label = $row->type_label;
        $payment->type = $type;
        $payment->clarifications = $row->clarifications;
        foreach($months as $month) {
            if ($month->date->year_month === $payment_date->format("Y-m")) {
                $month->total_amount = $month->total_amount + intval($payment->amount);
                if($type->id === 1 || $type->id === 2) {
                    $month->rent_amount = $month->rent_amount + intval($payment->amount);
                }
                $month->in_debt = ($month->rent_amount < intval($contract->value)) ? true : false;
                array_push($month->payments,$payment);
            }
        }
    }
    
    throwSuccess($months);
    $DB->close();
}
?>