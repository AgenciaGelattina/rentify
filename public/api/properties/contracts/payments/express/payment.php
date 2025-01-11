<?php
require '../../../../headers.php';
require '../../../../utils/general.php';

if (METHOD === 'POST') {
    require_once '../../../../database.php';
    $id = intval($DB->real_escape_string(POST['id']));
    $contract = $DB->real_escape_string(POST['contract']);
    $express = intval($DB->real_escape_string(POST['express']));
    $amount = intval($DB->real_escape_string(POST['amount']));
    $date = $DB->real_escape_string(POST['date']);
    $clarifications = $DB->real_escape_string(POST['clarifications']);

    if ($id > 0) {
        $payment = $DB->query("UPDATE contracts_payments SET express=$express,amount=$amount,date='$date',clarifications='$clarifications' WHERE id = $id");
        if ($DB->affected_rows >= 0) {
            throwSuccess(true);
        } else {
            throwError(203, "No se pudo guardar el pago #$id");
        }
    } else {
        $query ="INSERT INTO contracts_payments (contract,express,amount,date,clarifications) VALUES ($contract,$express,$amount,'$date','$clarifications')";
        $property_result = $DB->query($query);
        $newID = $DB->insert_id;
        if ($newID > 0) {
            throwSuccess(true);
        } else {
            throwError(203, "No se pudo guardar el pago.");
        }
    }

    $DB->close();
}

if (METHOD === 'DELETE') {
    require_once '../../../../database.php';
    $id = intval($DB->real_escape_string(POST['id']));
    $payment = $DB->query("DELETE FROM contracts_payments WHERE id = $id");
    if ($DB->affected_rows >= 0) {
        throwSuccess(true);
    } else {
        throwError(203, "No se pudo borrar el pago #$id");
    }
    $DB->close();
}
?>