<?php
require '../../headers.php';
require '../../utils/general.php';
require '../../utils/constants.php';
require '../../database.php';

if (METHOD === 'GET') {
    
    $status = $DB->real_escape_string($_GET['status']);
    $contract_query = "SELECT id,property,type,due_date,start_date,end_date,in_date,out_date,currency,canceled,finalized FROM property_contracts";

    if ($status === "current") {
        $property = intval($DB->real_escape_string($_GET['property_id']));
        $contract_query .= " WHERE property = $property AND canceled = 0 AND finalized = 0 AND end_date >= CURDATE()";
    }
    if ($status === "data") {
        $contract = intval($DB->real_escape_string($_GET['contract_id']));
        $contract_query .= " WHERE id = $contract";
    }
    
    require "./data/result.php";
    throwSuccess($contract);
    $DB->close();
}

if (METHOD === 'POST') {
    $id = intval($DB->real_escape_string(POST['id']));
    $property = intval($DB->real_escape_string(POST['property']));
    $currency = $DB->real_escape_string(POST['currency']);
    $due_date = intval($DB->real_escape_string(POST['due_date']));
    $start_date = $DB->real_escape_string(POST['start_date']);
    $end_date = $DB->real_escape_string(POST['end_date']);
    $in_date = $DB->real_escape_string(POST['in_date']);
    $out_date = $DB->real_escape_string(POST['out_date']);

    if ($id > 0) { 
        $fields = "due_date=$due_date,currency='$currency',start_date='$start_date',end_date='$end_date',in_date='$in_date',out_date='$out_date'";
        $account = $DB->query("UPDATE property_contracts SET $fields WHERE id=".$id); 
        if ($DB->affected_rows >= 0) {
            throwSuccess(true, "El contrato fue modificado.");
        } else {
            throwError(203, "Error al modificar contrato $id");
        }
    } else {
        $value = $DB->real_escape_string(POST['value']);
        $type = $DB->real_escape_string(POST['type']);

        $query_contract ="INSERT INTO property_contracts (`property`,`type`,`currency`,`due_date`,`start_date`,`end_date`,`in_date`,`out_date`) VALUES ($property,'$type','$currency',$due_date,'$start_date','$end_date','$in_date','$out_date')";
        $property_result = $DB->query($query_contract);
        $newID = $DB->insert_id;
        if ($newID > 0) {
            // default recurrent payment
            if ($type === "recurring") { 
                $query_payment ="INSERT INTO contracts_recurring_charges (contract,label,value,start_date,end_date) VALUES ($newID,'Renta','$value','$start_date','$end_date')";
            } else {
                $query_payment ="INSERT INTO contracts_express_charges (contract,label,value) VALUES ($newID,'Renta','$value')";
            }
            $payment_result = $DB->query($query_payment);

            // default folders
            $query_folders = "INSERT INTO contracts_folders (`name`,`contract`,`title`,`description`,`created`) VALUES ";
            $folders = [];
            foreach(POST['folders'] as $key => $folder) {
                $name = $folder['name'];
                $title = $folder['title'];
                $description = $folder['description'];
                array_push($folders, "('$name',$newID,'$title','$description',CURDATE())");
            }
            $query_folders .= implode(",", $folders);
            $folders_result = $DB->query($query_folders);

            throwSuccess(true, "El contrato con ID #$newID ha sido creado.");
        }else {
            throwError(203, "No se pudo crear el contrato");
        }
    }
    $DB->close();
}
?>