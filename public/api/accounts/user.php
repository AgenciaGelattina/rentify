<?php
require '../headers.php';
require '../utils/general.php';
require '../database.php';

if (METHOD === 'POST') {
    $id = intval($DB->real_escape_string(POST['id']));
    $names = $DB->real_escape_string(POST['names']);
    $surnames = $DB->real_escape_string(POST['surnames']);
    $email = $DB->real_escape_string(POST['email']);
    $role = intval($DB->real_escape_string(POST['role']));
    if ($id === 0) {
        $password = password_hash($DB->real_escape_string(POST['password']), PASSWORD_BCRYPT);
        $query ="INSERT INTO accounts (`names`,`surnames`,`email`,`role`,`password`,`created`) VALUES ('$names','$surnames','$email',$role,'$password',CURDATE())";
        $property = $DB->query($query);
        if ($DB->affected_rows > 0) {
            throwSuccess(true, "Se ha dado de alta al usuario $names $surnames, con correo $email.");
        } else {
           throwError(500, "No se pudo crear al usuario");
        }
    } else if ($id > 0) {
        $fields = "names='$names',surnames='$surnames',email='$email',role=$role,updated=NOW()";
        $account = $DB->query("UPDATE accounts SET ".$fields." WHERE id=".$id);
        if ($DB->affected_rows > 0) {
            throwSuccess(true, "Los datos de $names $surnames se han guardado.");
        } else {
            throwError(404, "User not saved.");
        }
    } else {
        throwError(404, "User not saved.");
    }
    $DB->close();
}
?>