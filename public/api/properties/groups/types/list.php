<?php
require '../../../headers.php';
require '../../../utils/general.php';

if (METHOD === 'GET') {
    require '../../../database.php';
    $data = $DB->query("SELECT id,label FROM groups_types WHERE id > 1");
    if ($data->num_rows > 0) {
        throwSuccess(getRowsArray($data));
    } else {
        throwError(203, "No se encontraron datos");
    }
}
?>