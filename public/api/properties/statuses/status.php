<?php
require '../../headers.php';
require '../../utils.php';
require '../../database.php';

if (METHOD === 'POST') {
    $id = intval($DB->real_escape_string(POST['id']));
    $label = $DB->real_escape_string(POST['label']);

    if ($id > 0) { 
        $fields = "label='$label'";
        $DB->query("UPDATE properties_status SET $fields WHERE id=".$id); 
        if ($DB->affected_rows >= 0) {
            throwSuccess(true, "El estadi de la propiedad #$id se ha moficado.");
        } else {
            throwError(203, "Error al guardar estado de propiedad #$id");
        }
    } else {
        $query ="INSERT INTO properties_status (`label`) VALUES ('$label')";
        $DB->query($query);
        $newID = $DB->insert_id;
        if ($newID > 0) {
            throwSuccess(true, "El estado de propiedad #$newID se ha creado.");
        } else {
            throwError(203, "No se pudo crear el estado de propiedad.");
        }
    }
}
?>