<?php
require '../../../headers.php';
require '../../../utils/general.php';
require '../../../utils/constants.php';
require '../../../database.php';

if (METHOD === 'POST') {
    $payment_id = intval($DB->real_escape_string(POST['payment_id']));
    $confirmed = intval($DB->real_escape_string(POST['confirmed']));
    $contract_id = intval($DB->real_escape_string(POST['contract_id']));

    if($confirmed === 1 || $confirmed === 0) {
        $payment = $DB->query("UPDATE contracts_payments SET confirmed = $confirmed WHERE id=".$payment_id);
        if ($DB->affected_rows >= 0) {
            $msg = $confirmed === 1 ? "confirmado" : "desconfirmado";

            $contract_query = "SELECT id,property,type,due_date,start_date,end_date,in_date,out_date,currency,canceled,finalized FROM property_contracts WHERE id=$contract_id";
            require "../contract_result.php";
            throwSuccess($contract, "El pago #$payment_id fue $msg.");
        } else {
            throwError(203, "Error al revisar pago #$payment_id");
        }
    } else {
        throwError(203, "Error al revisar pago #$payment_id");
    }
    
    $DB->close();
};

?>