<?php
require '../../headers.php';
require '../../utils.php';
require '../../database.php';

if (METHOD === 'POST') {
    $id = intval($DB->real_escape_string(POST['id']));
    $title = $DB->real_escape_string(POST['title']);
    $type = intval($DB->real_escape_string(POST['type']));
    $description = $DB->real_escape_string(POST['description']);
    $address = $DB->real_escape_string(POST['address']);
    $active = intval($DB->real_escape_string(POST['active']));

    if ($id > 0) { 
        $fields = "title='$title',type=$type,description='$description',address='$address',active=$active";
        $DB->query("UPDATE properties_groups SET $fields WHERE id=".$id); 
        if ($DB->affected_rows >= 0) {
            throwSuccess(true, "El grupo #$id se ha moficado.");
        } else {
            throwError(203, "Error al guardar contrato #$id");
        }
    } else {
        $query ="INSERT INTO properties_groups (`title`,`type`,`description`,`address`,`active`) VALUES ('$title',$type,'$description','$address',$active)";
        $DB->query($query);
        $newID = $DB->insert_id;
        if ($newID > 0) {
            throwSuccess(true, "El grupo #$newID se ha creado.");
        } else {
            throwError(203, "No se pudo crear el grupo");
        }
    }

}
?>