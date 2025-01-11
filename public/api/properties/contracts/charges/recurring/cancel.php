<?php
require '../../../../headers.php';
require '../../../../utils/general.php';
require '../../../../database.php';

if (METHOD === 'POST') {
    $id = intval($DB->real_escape_string(POST['id']));
    $cancel = intval($DB->real_escape_string(POST['cancel']));

    $account = $DB->query("UPDATE contracts_recurring_charges SET canceled = $cancel WHERE id=".$id);
    if ($DB->affected_rows >= 0) {
        $msg = $cancel === 1 ? "cancelado" : "reactivado";
        throwSuccess(true, "El Cobro Mensual #$id fue $msg.");
    } else {
        throwError(203, "Error al cancelar el Cobro Mensual #$id");
    }
    
    $DB->close();
}
?>