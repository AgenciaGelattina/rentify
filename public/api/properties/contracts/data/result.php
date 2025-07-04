<?php
$contract_result = $DB->query($contract_query);

$contract = new stdClass();
$contract->id = 0;
if ($contract_result->num_rows > 0) {
    $row = $contract_result->fetch_object();

    // CONTRACT
    $contract->id = $row->id;
    $contract->currency = $row->currency;
    $contract->type = $row->type;

    $contract->start_date = addTMZero($row->start_date);
    $contract_start_date_time = new DateTime($row->start_date);
    $contract->end_date = addTMZero($row->end_date);
    $contract_end_date_time = new DateTime($row->end_date);

    $contract->in_date = addTMZero($row->in_date);
    //$contract_in_date_time = new DateTime($row->in_date);
    $contract->out_date = addTMZero($row->out_date);
    //$contract_out_date_time = new DateTime($row->out_date);

    $contract->expired = boolval($NOW->time > $contract_end_date_time);
    $contract->canceled = boolval($row->canceled);
    $contract->finalized = boolval($row->finalized);
    
    // add $contract data by type
    require $row->type.".php";
}
?>