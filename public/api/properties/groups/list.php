<?php
require '../../headers.php';
require '../../utils.php';

if (METHOD === 'GET') {
    require '../../database.php';
    $properties_groups = $DB->query("SELECT id,title AS label FROM properties_groups WHERE active = 1");
    if ($properties_groups->num_rows > 0) {
        echo json_encode(getRowsArray($properties_groups), JSON_NUMERIC_CHECK | JSON_BIGINT_AS_STRING);
    } else {
        throwError(404, "No groups found");
    }
}
?>