<?php
require '../../headers.php';
require '../../utils.php';
require '../../database.php';

$contractField = "id,value,property,due_date,init_date,end_date";

if (METHOD === 'GET') {
    $property = intval($DB->real_escape_string($_GET['property_id']));
    $query = "SELECT $contractField FROM property_contracts WHERE property = $property AND init_date <= CURDATE() AND end_date >= CURDATE()";
    $property_result = $DB->query($query);
    
    if ($property_result->num_rows > 0) {
        $property_data = $property_result->fetch_object();
        echo json_encode($property_data, JSON_NUMERIC_CHECK | JSON_BIGINT_AS_STRING);
    } else {
        echo json_encode(['id'=> 0], JSON_NUMERIC_CHECK | JSON_BIGINT_AS_STRING);
    }
}

if (METHOD === 'POST') {
    $id = intval($DB->real_escape_string(POST['id']));
    $property = intval($DB->real_escape_string(POST['property']));
    $value = $DB->real_escape_string(POST['value']);
    $due_date = intval($DB->real_escape_string(POST['due_date']));
    $init_date = $DB->real_escape_string(POST['init_date']);
    $end_date = $DB->real_escape_string(POST['end_date']);

    if ($id > 0) { 
        $fields = "value='$value',due_date=$due_date,init_date='$init_date',end_date='$end_date'";
        $account = $DB->query("UPDATE property_contracts SET $fields WHERE id=".$id); 
        if ($DB->affected_rows >= 0) {
            $query = "SELECT $contractField FROM property_contracts WHERE id = ".$id;
            $property_result = $DB->query($query);
            echo json_encode($property_result->fetch_object(), JSON_NUMERIC_CHECK | JSON_BIGINT_AS_STRING);            
        } else {
            throwError(404, "Error al guardar contrato $id");
        }
    } else {
        $query ="INSERT INTO property_contracts (`property`,`value`,`due_date`,`init_date`,`end_date`,`created`) VALUES ($property,'$value',$due_date,'$init_date','$end_date',CURDATE())";
        $property_result = $DB->query($query);
        $newID = $DB->insert_id;
        if ($newID > 0) {
            $query = "SELECT $contractField FROM property_contracts WHERE id = ".$newID;
            $property_result = $DB->query($query);
            echo json_encode($property_result->fetch_object(), JSON_NUMERIC_CHECK | JSON_BIGINT_AS_STRING);
        } else {
            throwError(404, "No se pudo crear el contrato");
        }
    }

}