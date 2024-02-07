<?php
require '../../../headers.php';
require '../../../utils.php';

if (METHOD === 'GET') {
    require_once '../../../database.php';
    $contract_id = $DB->real_escape_string($_GET['contract_id']);
    $query = "SELECT id,names,surnames,email,phone FROM contracts_contractors WHERE contract = $contract_id";
    $contractors = $DB->query($query);
    throwSuccess(getRowsArray($contractors));
    $DB->close();
}
?>