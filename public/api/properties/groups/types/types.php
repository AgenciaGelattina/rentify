<?php
require '../../../headers.php';
require '../../../utils.php';

if (METHOD === 'GET') {
    require '../../../database.php';
    $data = $DB->query("SELECT id,label FROM groups_types");
    if ($data->num_rows > 0) {
        throwSuccess(getRowsArray($data));
    } else {
        throwError(203, "No se encontraron datos");
    }
}
?>