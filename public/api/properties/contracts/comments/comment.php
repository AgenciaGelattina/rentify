<?php
require '../../../headers.php';
require '../../../utils/general.php';

if (METHOD === 'POST') {
    require_once '../../../database.php';
    $id = intval($DB->real_escape_string(POST['id']));
    $account = intval($DB->real_escape_string(POST['account']));
    $property = intval($DB->real_escape_string(POST['property']));
    $contract = intval($DB->real_escape_string(POST['contract']));
    $text = $DB->real_escape_string(POST['text']);

    if ($id > 0) {
        $DB->query("UPDATE comments SET text='$text',checked=0 WHERE id=$id"); 
        if ($DB->affected_rows >= 0) {
            throwSuccess(true, "Se modificó el comentario.");    
        } else {
            throwError(203, "Error al modificar comentario #$id");
        }
    } else {
        $query ="INSERT INTO comments (`account`,`property`,`contract`,`text`,`created`) VALUES ($account,$property,$contract,'$text',CURDATE())";
        $DB->query($query);
        $newID = $DB->insert_id;
        if ($newID > 0) {
            throwSuccess(true, "Se publicó el comentario.");
        } else {
            throwError(203, "No se pudo publicar el comentario.");
        }
    }
    $DB->close();
}

if (METHOD === 'DELETE') {
    require_once '../../../database.php';
    $comment = intval($DB->real_escape_string(POST['comment']));
    $DB->query("DELETE FROM comments WHERE id=$comment"); 
    if ($DB->affected_rows >= 0) {
        throwSuccess(true, "Se borró el comentario.");    
    } else {
        throwError(203, "Error al borrar comentario #$id");
    }
    $DB->close();
}
?>