<?php
require '../../headers.php';
require '../../utils.php';
require '../../database.php';

$contractField = "id,value,property,due_date,start_date,end_date";

if (METHOD === 'GET') {
    $property = intval($DB->real_escape_string($_GET['property_id']));
    $query = "SELECT $contractField FROM property_contracts WHERE property = $property AND start_date <= CURDATE() AND end_date >= CURDATE()";
    $contract_result = $DB->query($query);
    
    if ($contract_result->num_rows > 0) {
        $contract = $contract_result->fetch_object();
        $contract->start_date = $contract->start_date."T00:00:00";
        $contract->end_date = $contract->end_date."T00:00:00";
        throwSuccess($contract);
    } else {
        throwSuccess(["id"=>0]);
    }
    $DB->close();
}

if (METHOD === 'POST') {
    $id = intval($DB->real_escape_string(POST['id']));
    $property = intval($DB->real_escape_string(POST['property']));
    $value = $DB->real_escape_string(POST['value']);
    $due_date = intval($DB->real_escape_string(POST['due_date']));
    $start_date = $DB->real_escape_string(POST['start_date']);
    $end_date = $DB->real_escape_string(POST['end_date']);

    if ($id > 0) { 
        $fields = "value='$value',due_date=$due_date,start_date='$start_date',end_date='$end_date'";
        $account = $DB->query("UPDATE property_contracts SET $fields WHERE id=".$id); 
        if ($DB->affected_rows >= 0) {
            $query = "SELECT $contractField FROM property_contracts WHERE id = ".$id;
            $contract_result = $DB->query($query);
            $contract = $contract_result->fetch_object();
            $contract->start_date = $contract->start_date."T00:00:00";
            $contract->end_date = $contract->end_date."T00:00:00";
            throwSuccess($contract);
        } else {
            throwError(203, "Error al guardar contrato $id");
        }
    } else {
        $query ="INSERT INTO property_contracts (`property`,`value`,`due_date`,`start_date`,`end_date`,`created`) VALUES ($property,'$value',$due_date,'$start_date','$end_date',CURDATE())";
        $property_result = $DB->query($query);
        $newID = $DB->insert_id;
        if ($newID > 0) {
            $query = "SELECT $contractField FROM property_contracts WHERE id = ".$newID;
            $contract_result = $DB->query($query);
            $contract = $contract_result->fetch_object();
            $contract->start_date = $contract->start_date."T00:00:00";
            $contract->end_date = $contract->end_date."T00:00:00";
            throwSuccess($contract);
        } else {
            throwError(203, "No se pudo crear el contrato");
        }
    }
    $DB->close();
}
?>