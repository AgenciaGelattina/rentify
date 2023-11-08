<?php
require '../../headers.php';
require '../../utils.php';

if (METHOD === 'GET') {
    require '../../database.php';
    $properties_types = $DB->query("SELECT id,label FROM properties_types");
    if ($properties_types->num_rows > 0) {
        echo json_encode(getRowsArray($properties_types), JSON_NUMERIC_CHECK | JSON_BIGINT_AS_STRING);
    } else {
        throwError(404, "No types found");
    }
}
?>