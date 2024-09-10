<?php
require '../../headers.php';
require '../../utils/general.php';

if (METHOD === 'GET') {
    require '../../database.php';
    $data = $DB->query("SELECT id,title AS label FROM properties_groups WHERE active = 1");
    if ($data->num_rows > 0) {
        throwSuccess(getRowsArray($data));
    } else {
        throwError(303, "No se encontraron grupos.");
    }
}
?>