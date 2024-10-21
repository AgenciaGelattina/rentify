<?php
require '../../headers.php';
require '../../utils/general.php';
require '../../database.php';

if (METHOD === 'POST') {
    $id = intval($DB->real_escape_string(POST['contract_id']));
    $finalize = intval($DB->real_escape_string(POST['finalize']));
    $account = $DB->query("UPDATE property_contracts SET finalized = $finalize WHERE id=".$id); 
    if ($DB->affected_rows >= 0) {
        $msg = $finalize === 1 ? "finalizado" : "reactivado";
        throwSuccess(true, "El contrato #$id fue $msg.");
    } else {
        throwError(203, "Error al finalizar contrato #$id");
    }
    
    $DB->close();
}
?>