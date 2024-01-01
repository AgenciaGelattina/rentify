<?php
require '../../headers.php';
require '../../utils.php';

if (METHOD === 'GET') {
    $contractField = "id,value,property,due_date,init_date,end_date";
    require_once '../../database.php';
    $query = "SELECT $propertyFields FROM property_contracts WHERE property = ".$id;
    $property_result = $DB->query($query);
    if ($property_result->affected_rows > 0) {
        throwSuccess($property_result->fetch_object());
    } else {
        throwError(203, "No se encontraron contratos");
    }
}

?>