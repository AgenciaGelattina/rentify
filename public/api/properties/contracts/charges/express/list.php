<?php
require '../../../../headers.php';
require '../../../../utils/general.php';

if (METHOD === 'GET') {
    require_once '../../../../database.php';
    $contract_id = intval($DB->real_escape_string($_GET['contract']));
    $payment_date = intval($DB->real_escape_string($_GET['date']));
    $query = "SELECT id,label FROM contracts_express_charges WHERE contract = $contract_id AND canceled = 0";
    $express = $DB->query($query);
    
    $express_charges = [];
    while($express_charge=$express->fetch_object()) {
        array_push($express_charges,$express_charge);
    }
    throwSuccess($express_charges);
    $DB->close();
}
?>