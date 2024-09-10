<?php
require '../../headers.php';
require '../../utils/general.php';

// No se usa
if (METHOD === 'GET') {
    $contractField = "id,property,due_date,start_date,end_date";
    require_once '../../database.php';
    $query = "SELECT $propertyFields FROM property_contracts WHERE property = ".$id;
    $constract_result = $DB->query($query);
    if ($constract_result->affected_rows > 0) {
        $contract = $constract_result->fetch_object();
        $contract->start_date = $contract->start_date."T00:00:00";
        $contract->end_date = $contract->end_date."T00:00:00";
        throwSuccess($contract);
    } else {
        throwError(203, "No se encontraron contratos");
    }
    $DB->close();
}

?>