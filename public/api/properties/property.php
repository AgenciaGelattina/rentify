<?php
require '../headers.php';
require '../utils.php';


if (METHOD === 'GET') {
    require_once '../database.php';
    $id = intval($DB->real_escape_string($_GET['id']));

    $query = "SELECT * FROM properties WHERE id = ".$id;
    $property = $DB->query($query);
    
    if ($property->num_rows > 0) {
        echo json_encode($property->fetch_object(), JSON_NUMERIC_CHECK | JSON_BIGINT_AS_STRING);
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
        $query ="INSERT INTO properties (`title`, `description`, `type`, `status`, `group`, `active`, `created`) VALUES ('".$title."','".$description."', $type, $status, $group, 1, CURDATE())";
        $property = $DB->query($query);
        if ($DB->affected_rows > 0) {
            echo json_encode(['success' => 1], JSON_NUMERIC_CHECK | JSON_BIGINT_AS_STRING);
        } else {
            echo json_encode(['error' => ['message'=> "No se pudo crear la propuiedad.".$query, 'staus' => 500]]);
        }
    } else if ($id > 0) {
        $fields = "`title`='".$title."', `description`='".$description."', `type`=".$type.", `status`=".$status.", `group`=".$group;
        $property = $DB->query("UPDATE properties SET ".$fields." WHERE id=".$id);
        if ($DB->affected_rows > 0) {
            echo json_encode(['success' => 1], JSON_NUMERIC_CHECK | JSON_BIGINT_AS_STRING);
        } else {
            echo json_encode(['error' => ['message'=> "No se pudieron guardar los datos", 'staus' => 500]]);
        }
    } else {
        throwError(500, "Property ID not valid.");
    }
}

?>