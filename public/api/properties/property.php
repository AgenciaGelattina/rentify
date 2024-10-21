<?php
require '../headers.php';
require '../utils/general.php';

if (METHOD === 'GET') {
    require_once '../database.php';
    $id = intval($DB->real_escape_string($_GET['id']));

    $query = "SELECT * FROM properties WHERE id = ".$id;
    $property = $DB->query($query);
    
    if ($property->num_rows > 0) {
        throwSuccess($property->fetch_object());
    } else {
        throwError(404, "No property found");
    }
}

if (METHOD === 'POST') {
    require_once '../database.php';
    $id = intval($DB->real_escape_string(POST['id']));
    $title = $DB->real_escape_string(POST['title']);
    $description = $DB->real_escape_string(POST['description']);
    $type = intval($DB->real_escape_string(POST['type']));
    $status = intval($DB->real_escape_string(POST['status']));
    $group = intval($DB->real_escape_string(POST['group']));
    if ($id === 0) {
        $query ="INSERT INTO properties (`title`, `description`, `type`, `status`, `group`, `active`) VALUES ('".$title."','".$description."', $type, $status, $group, 1)";
        $property = $DB->query($query);
        if ($DB->affected_rows > 0) {
            throwSuccess(true, "Se ha creado la propiedad");
        } else {
            throwError(203, "No se pudo crear la propiedad.");
        }
    } else if ($id > 0) {
        $fields = "`title`='".$title."', `description`='".$description."', `type`=".$type.", `status`=".$status.", `group`=".$group;
        $property = $DB->query("UPDATE properties SET ".$fields." WHERE id=".$id);
        if ($DB->affected_rows > 0) {
            throwSuccess(true, "Los datos de la propiedad se modificaron.");
        } else {
            throwError(203, "No se pudo moficar la propiedad.");
        }
    } else {
        throwError(203, "Property ID not valid.");
    }
}

?>