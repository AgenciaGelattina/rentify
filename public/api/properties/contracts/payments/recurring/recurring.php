<?php
require '../../../../headers.php';
require '../../../../utils/general.php';

if (METHOD === 'POST') {
    require_once '../../../../database.php';
    $id = intval($DB->real_escape_string(POST['id']));
    $contract_id = intval($DB->real_escape_string(POST['contract']));
    $label = $DB->real_escape_string(POST['label']);
    $value = intval($DB->real_escape_string(POST['value']));
    $start_date = $DB->real_escape_string(POST['start_date']);
    $end_date = $DB->real_escape_string(POST['end_date']);

    if ($id > 0) {
        $payment = $DB->query("UPDATE contracts_recurring_payments SET value=$value,label='$label',start_date='$start_date',end_date='$end_date' WHERE id = $id");
        if ($DB->affected_rows >= 0) {
            throwSuccess(true);
        } else {
            throwError(203, "No se pudo modificar el pago recurrente #$id");
        }
    } else {
        $query ="INSERT INTO contracts_recurring_payments (contract,label,value,start_date,end_date) VALUES ($contract_id,'$label',$value,'$start_date','$end_date')";
        $property_result = $DB->query($query);
        $newID = $DB->insert_id;
        if ($newID > 0) {
            throwSuccess(true);
        } else {
            throwError(203, "No se pudo guardar el pago recurrente.");
        }
    }
    $DB->close();
}

if (METHOD === 'GET') {
    require_once '../../../../database.php';
    $recurringPaymentsFields = "id,contract,label,value,start_date,end_date";
    $contract_id = intval($DB->real_escape_string($_GET['contract']));
    //recurring
    $query = "SELECT $recurringPaymentsFields FROM contracts_recurring_payments WHERE contract = $contract_id";
    $recurring_result = $DB->query($query);
    if ($recurring_result->num_rows > 0) {
        $recurringPayments = [];
        while($recurringPayment=$recurring_result->fetch_object()) {
            $recurringPayment->start_date = $recurringPayment->start_date."T00:00:00";
            $recurringPayment->end_date = $recurringPayment->end_date."T00:00:00";
            array_push($recurringPayments, $recurringPayment);
        }
        throwSuccess($recurringPayments);
    } else {
        throwError(203, "No hay pagos recurrentes.");
    }
    $DB->close();
}
?>