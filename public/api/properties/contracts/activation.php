<?php
require '../../headers.php';
require '../../utils/general.php';
require '../../database.php';

if (METHOD === 'POST') {
    $id = intval($DB->real_escape_string(POST['contract_id']));
    $action = $DB->real_escape_string(POST['action']);
    if ($action === "cancel") {
        $account = $DB->query("UPDATE property_contracts SET active = 0 WHERE id=".$id); 
        if ($DB->affected_rows >= 0) {
            throwSuccess(true, "El contrato #$id fue cancelado.");
        } else {
            throwError(203, "Error al cancelar contrato #$id");
        }
    }
    $DB->close();
}
?>