<?php
require '../../../../headers.php';
require '../../../../utils/general.php';
require '../../../../database.php';

if (METHOD === 'POST') {
    $id = intval($DB->real_escape_string(POST['id']));

    $query = "SELECT COUNT(id) AS count FROM contracts_payments WHERE express = $id";
    $exp_result = $DB->query($query);
    $number = $exp_result->fetch_object()->count;
    if ($number > 0) {
        throwError(203, "No se puede borrar el Cobro Express #$id porque tiene $number pagos vinculados.");
        $DB->close();
    } else {

    
        $query = $DB->query("DELETE FROM contracts_express_charges WHERE id = $id");
        if ($DB->affected_rows >= 0) {
            throwSuccess(true, "Se ha borrado el Cobro Express #$id");
        } else {
            throwError(203, "No se pudo borrar el Cobro Express #$id");
        };
        
        $DB->close();
    }
}
?>