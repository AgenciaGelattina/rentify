<?php
require '../../headers.php';
require '../../utils.php';
require '../../database.php';

if (METHOD === 'GET') {
    $name = $DB->real_escape_string($_GET['name']);
    $query = "SELECT `name`,`contract` AS contract_id,`title`,`description` FROM contracts_folders WHERE name = name";
    $folder_result = $DB->query($query);
    echo json_encode($folder_result->fetch_object(), JSON_NUMERIC_CHECK | JSON_BIGINT_AS_STRING);
}

if (METHOD === 'POST') {
    $action = $DB->real_escape_string(POST['action']);
    $name = $DB->real_escape_string(POST['name']);
    $contract_id = intval($DB->real_escape_string(POST['contract_id']));
    $title = $DB->real_escape_string(POST['title']);
    $description = $DB->real_escape_string(POST['description']);

    if ($action === 'update') { 
        $fields = "title='$title',description='$description'";
        $contract_result = $DB->query("UPDATE contracts_folders SET $fields WHERE name= '$name'");

        if ($DB->affected_rows > 0) {
            throwSuccess("La carpeta se actualizó de forma exitosa");
        } else {
            throwError(404, "Error al guardar la carpeta");
        }
    } else {
        $query ="INSERT INTO contracts_folders (`name`,`contract`,`title`,`description`,`created`) VALUES ('$name',$contract_id,'$title','$description',CURDATE())";
        $property_result = $DB->query($query);
        throwSuccess("La carpeta se creó de forma exitosa");
    }
}

?>