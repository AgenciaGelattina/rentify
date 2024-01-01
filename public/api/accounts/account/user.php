<?php
require '../../headers.php';
require '../../utils.php';

if (METHOD === 'GET') {
    require '../../database.php';
    $id = intval($DB->real_escape_string($_GET['id']));
    $account = $DB->query("SELECT id,names,surnames,email,role,active,created,updated FROM accounts WHERE id=".$id);
    if ($account->num_rows > 0) {
        throwSuccess($account->fetch_object());
    } else {
        throwError(203, "No se ha encontado al usuario #$id");
    }
    $DB->close();
}

if (METHOD === 'POST') {
    require '../../database.php';
    $id = intval($DB->real_escape_string(POST['id']));
    $names = $DB->real_escape_string(POST['names']);
    $surnames = $DB->real_escape_string(POST['surnames']);
    $email = $DB->real_escape_string(POST['email']);
    
    $account = $DB->query("UPDATE accounts SET names='$names',surnames='$surnames',email='$email',updated=NOW() WHERE id=$id");
    if ($DB->affected_rows > 0) {
        throwSuccess(true, "Los datos fueron actualizados.");
    } else {
        throwError(203, "No se guardaron los datos.");
    }
    $DB->close();
}

?>