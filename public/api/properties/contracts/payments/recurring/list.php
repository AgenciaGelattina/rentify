<?php
require '../../../../headers.php';
require '../../../../utils/general.php';

if (METHOD === 'GET') {
    require_once '../../../../database.php';
    $contract_id = intval($DB->real_escape_string($_GET['contract']));
    $payment_date = intval($DB->real_escape_string($_GET['date']));
    $query = "SELECT id,label FROM contracts_recurring_payments WHERE contract = $contract_id AND canceled = 0";
    $recurring = $DB->query($query);
    
    $recurringPayments = [];
    while($recurringPayment=$recurring->fetch_object()) {
        array_push($recurringPayments,$recurringPayment);
    }
    throwSuccess($recurringPayments);
    $DB->close();
}
?>