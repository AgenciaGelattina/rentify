<?php
require '../../headers.php';
require '../../utils.php';

if (METHOD === 'GET') {
    require '../../database.php';
    $property = intval($DB->real_escape_string($_GET['property_id']));
    $query = "SELECT pc.id,pc.value,pc.property,pc.due_date,pc.start_date,pc.end_date,(SELECT SUM(cp.amount) FROM contracts_payments AS cp WHERE cp.contract = pc.id GROUP BY cp.contract) AS total_amount FROM property_contracts AS pc WHERE pc.property = $property AND pc.end_date <= CURDATE()";
    $contracts_result = $DB->query($query);
    
    $contracts = [];
    while($row=$contracts_result->fetch_object()){
        // Contract
        $contract = new stdClass();
        $contract->id = $row->id;
        $contract->value = $row->value;
        $contract->start_date = $row->start_date."T00:00:00";
        $contract->end_date = $row->end_date."T00:00:00";
        $contract->due_date = $row->end_date;

        $init = new DateTimeImmutable($row->start_date);
        $start_date_time = new DateTime($init->format("Y-m"));
        $end = new DateTimeImmutable($row->end_date);
        $end_date_time = new DateTime($end->format("Y-m")); 
        $today_time = new DateTime(date("Y-m-d"));
        $due_date_time = new DateTime($due_date);                               

        $diff = $end_date_time->diff($start_date_time); 
        $total_months = (($diff->y) * 12) + ($diff->m);
        $contract->total_months = $total_months;
        $contract->current_months = $total_months;
        $contract->pending_months = 0;

        $total_amount_pending = $row->value * $current_months;
        $total_amount = $row->total_amount ?: 0;
        
        $contract->in_debt = ($total_amount < $total_amount_pending);
        $contract->rent_is_due = ($today_time >= $due_date_time);
        $contract->debt = $total_amount_pending - $total_amount;

        array_push($contracts, $contract);
    }
    throwSuccess($contracts);
    $DB->close();
}

?>