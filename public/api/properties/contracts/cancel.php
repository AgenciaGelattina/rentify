<?php
require '../../headers.php';
require '../../utils/general.php';
require '../../utils/constants.php';
require '../../database.php';

if (METHOD === 'POST') {
    $contract_id = intval($DB->real_escape_string(POST['contract_id']));
    $cancel = intval($DB->real_escape_string(POST['cancel']));

    if ($cancel === 0) {
        $property = intval($DB->real_escape_string(POST['property_id']));
        $query = "SELECT id FROM property_contracts WHERE property = $property AND canceled = 0 AND finalized = 0 AND end_date >= CURDATE()";
        $contract_result = $DB->query($query);
    
        if ($contract_result->num_rows > 0) {
            throwError(203, "Error al re-activar contrato #$contract_id. Ya existe un contrato activo vigente.");
            $DB->close();
            exit();
        }
    }

    $account = $DB->query("UPDATE property_contracts SET canceled = $cancel WHERE id=".$contract_id);
    if ($DB->affected_rows >= 0) {
        $msg = $cancel === 1 ? "cancelado" : "reactivado";

        $contract_query = "SELECT id,property,type,due_date,start_date,end_date,in_date,out_date,currency,canceled,finalized FROM property_contracts WHERE id=$contract_id";
        require "data/result.php";
        throwSuccess($contract, "El contrato #$contract_id fue $msg.");
    } else {
        throwError(203, "Error al cancelar contrato #$contract_id");
    }
    
    $DB->close();
}
?>