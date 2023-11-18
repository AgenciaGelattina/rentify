<?php
require '../../headers.php';
require '../../utils.php';

if (METHOD === 'GET') {
    require '../../database.php';
    $properties_status = $DB->query("SELECT id,label FROM properties_status");
    if ($properties_status->num_rows > 0) {
        throwSuccess(getRowsArray($properties_status));
    } else {
        throwError(203, "No se encontraron datos");
    }
}
?>