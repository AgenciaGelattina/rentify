<?php
require '../../headers.php';
require '../../utils.php';

if (METHOD === 'GET') {
    require '../../database.php';
    $properties_types = $DB->query("SELECT id,label FROM properties_types");
    if ($properties_types->num_rows > 0) {
        throwSuccess(getRowsArray($properties_types));
    } else {
        throwError(203, "No se encontraron datos");
    }
}
?>