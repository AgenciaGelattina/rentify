<?php
require '../../headers.php';
require '../../utils/general.php';

if (METHOD === 'POST' && isset($_GET['token'])) {
    require '../../jwt.php';
    try {
        $jwt = new JwtHandler();
        $user = $jwt->jwtDecodeData($_GET['token']);
        if(isset($user->id) && isset($user->email)) {
            require '../../database.php';
            $password = password_hash($DB->real_escape_string(POST['password']), PASSWORD_BCRYPT);
            $DB->query("UPDATE accounts SET password='$password',updated=NOW() WHERE id=$user->id AND email='$user->email'");
            if ($DB->affected_rows > 0) {
                throwSuccess(true, "El password fué actualizado.");
            } else {
                throwError(203, "No se guardaron los datos.");
            }
            $DB->close();
        } else {
            throwError(203, "Token no válido.");
        }
    } catch(Exception $e) {
        throwError(203, $e->getMessage());
    }
} else {
    throwError(203, "No se pudo autorizar la petición.");
}
?>