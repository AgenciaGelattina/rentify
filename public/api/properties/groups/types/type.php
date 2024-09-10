<?php
require '../../../headers.php';
require '../../../utils/general.php';
require '../../../database.php';

if (METHOD === 'POST') {
    $id = intval($DB->real_escape_string(POST['id']));
    $label = $DB->real_escape_string(POST['label']);

    if ($id > 0) { 
        $fields = "label='$label'";
        $DB->query("UPDATE groups_types SET $fields WHERE id=".$id); 
        if ($DB->affected_rows >= 0) {
            throwSuccess(true, "El tipo de grupo #$id se ha moficado.");
        } else {
            throwError(203, "Error al guardar tipo de grupo #$id");
        }
    } else {
        $query ="INSERT INTO groups_types (`label`) VALUES ('$label')";
        $DB->query($query);
        $newID = $DB->insert_id;
        if ($newID > 0) {
            throwSuccess(true, "El tipo de grupo #$newID se ha creado.");
        } else {
            throwError(203, "No se pudo crear el tipo de grupo.");
        }
    }
}
?>