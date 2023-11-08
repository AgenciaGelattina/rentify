<?php
require '../../headers.php';
require '../../utils.php';

if (METHOD === 'GET') {
    $contractField = "id,value,property,due_date,init_date,end_date";
    require_once '../../database.php';
    $query = "SELECT $propertyFields FROM property_contracts WHERE property = ".$id;
    $property_result = $DB->query($query);
    if ($property_result->affected_rows > 0) {
        echo json_encode($property_result->fetch_object(), JSON_NUMERIC_CHECK | JSON_BIGINT_AS_STRING);
    } else {
        throwError(404, "Error al guardar contrato #$id");
    }
}

?>