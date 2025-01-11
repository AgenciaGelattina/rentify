<?php
require '../../../../headers.php';
require '../../../../utils/general.php';

if (METHOD === 'GET') {
    require_once '../../../../database.php';
    $contract_id = intval($DB->real_escape_string($_GET['contract']));
    $payment_date = $DB->real_escape_string($_GET['date']);
    $query = "SELECT id,label FROM contracts_recurring_charges WHERE contract = $contract_id AND canceled = 0";
    $recurring = $DB->query($query);
    
    $recurring_charges = [];
    while($recurring_charge=$recurring->fetch_object()) {
        array_push($recurring_charges,$recurring_charge);
    }
    throwSuccess($recurring_charges);
    $DB->close();
}
?>