<?php
require '../../../../headers.php';
require '../../../../utils/general.php';
require '../../../../database.php';

if (METHOD === 'POST') {
    $id = intval($DB->real_escape_string(POST['id']));

    $query = "SELECT COUNT(id) AS count FROM contracts_payments WHERE recurring = $id";
    $rec_result = $DB->query($query);
    $number = $rec_result->fetch_object()->count;
    if ($number > 0) {
        throwError(203, "No se puede borrar el Cobro Mensual #$id porque tiene $number pagos vinculados.");
        $DB->close();
    } else {

    
        $query = $DB->query("DELETE FROM contracts_recurring_charges WHERE id = $id");
        if ($DB->affected_rows >= 0) {
            throwSuccess(true, "Se ha borrado el Cobro Mensual #$id");
        } else {
            throwError(203, "No se pudo borrar el Cobro Mensual #$id");
        };
        
        $DB->close();
    }
}
?>