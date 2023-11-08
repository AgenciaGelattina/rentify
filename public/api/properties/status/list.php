<?php
require '../../headers.php';
require '../../utils.php';

if (METHOD === 'GET') {
    require '../../database.php';
    $properties_status = $DB->query("SELECT id,label FROM properties_status");
    if ($properties_status->num_rows > 0) {
        echo json_encode(getRowsArray($properties_status), JSON_NUMERIC_CHECK | JSON_BIGINT_AS_STRING);
    } else {
        throwError(404, "No status found");
    }
}
?>