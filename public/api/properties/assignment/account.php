<?php
require '../../headers.php';
require '../../utils/general.php';

if (METHOD === 'POST') {
    require '../../database.php';
    $property_id = intval($DB->real_escape_string(POST['property']));
    $account_id = intval($DB->real_escape_string(POST['account']));

    $property_query = $DB->query("UPDATE properties SET assignment = $account_id WHERE id = $property_id");
    if ($DB->affected_rows >= 0) {
        throwSuccess(true, "Se asignó la propiedad.");
    } else {
        throwError(303, "No se pudo asignar la propiedad.");
    }
}
?>