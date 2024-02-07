<?php
require '../../../headers.php';
require '../../../utils.php';

if (METHOD === 'POST') {
    require_once '../../../database.php';
    $id = intval($DB->real_escape_string(POST['id']));
    $contract_id = intval($DB->real_escape_string(POST['contract']));
    $type = intval($DB->real_escape_string(POST['type']));
    $amount = intval($DB->real_escape_string(POST['amount']));
    $date = $DB->real_escape_string(POST['date']);
    $clarifications = $DB->real_escape_string(POST['clarifications']);
    if ($id > 0) {
        $payment = $DB->query("UPDATE contracts_payments SET amount=$amount,type=$type,date='$date',clarifications='$clarifications' WHERE id = $id");
        if ($DB->affected_rows >= 0) {
            throwSuccess(true);
        } else {
            throwError(203, "No se pudo guardar el pago #$id");
        }
    } else {
        $query ="INSERT INTO contracts_payments (contract,amount,type,date,clarifications,created) VALUES ($contract_id,$amount,$type,'$date','$clarifications',CURDATE())";
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
?>