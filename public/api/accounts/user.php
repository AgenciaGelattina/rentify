<?php
require '../headers.php';
require '../utils.php';
require '../database.php';

if (METHOD === 'GET') {
    $id = intval($DB->real_escape_string($_GET['id']));
    $account = $DB->query("SELECT id,names,surnames,email,role,active,created,updated FROM accounts WHERE id=".$id);
    if ($account->num_rows > 0) {
        echo json_encode($account->fetch_object(), JSON_NUMERIC_CHECK | JSON_BIGINT_AS_STRING);
    } else {
        throwError(404, "User not found.");
    }
}

if (METHOD === 'POST') {
    $id = intval($DB->real_escape_string(POST['id']));
    $names = $DB->real_escape_string(POST['names']);
    $surnames = $DB->real_escape_string(POST['surnames']);
    $email = $DB->real_escape_string(POST['email']);
    $role = intval($DB->real_escape_string(POST['role']));
    if ($id === 0) {
        $password = password_hash($DB->real_escape_string(POST['password']), PASSWORD_BCRYPT);
        $query ="INSERT INTO accounts (`names`,`surnames`,`email`,`role`,`password`,`created`) VALUES ('".$names."','".$surnames."','".$email."',$role,'".$password."',CURDATE())";
        $property = $DB->query($query);
        if ($DB->affected_rows > 0) {
            echo json_encode(['success' => 1], JSON_NUMERIC_CHECK | JSON_BIGINT_AS_STRING);
        } else {
           throwError(500, "No se pudo crear al usuario");
        }
    } else if ($id > 0) {
        $fields = "names='".$names."',surnames='".$surnames."',email='".$email."',role=".$role;
        $account = $DB->query("UPDATE accounts SET ".$fields." WHERE id=".$id);
        if ($DB->affected_rows > 0) {
            echo json_encode(["success" => 1], JSON_NUMERIC_CHECK | JSON_BIGINT_AS_STRING);
        } else {
            throwError(404, "User not saved.");
        }
    } else {
        throwError(404, "User not saved.");
    }
}
?>