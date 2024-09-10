<?php
require '../../../headers.php';
require '../../../utils/general.php';

if (METHOD === 'GET') {
    require_once '../../../database.php';
    $contract_id = $DB->real_escape_string($_GET['contract_id']);
    $query = "SELECT id,CONCAT(names,' ',surnames) AS label FROM contracts_contractors WHERE contract = $contract_id";
    $contractors = $DB->query($query);
    if ($contractors->num_rows > 0) {
        throwSuccess(getRowsArray($contractors));
    } else {
        throwError(203, "No se encontraron inquilinos para este contrato.");
    }
    $DB->close();
}
?>