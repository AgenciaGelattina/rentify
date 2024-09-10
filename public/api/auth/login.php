<?php
require '../headers.php';
require '../utils/general.php';

if (METHOD === 'POST') {
    require '../database.php';
    $email = $DB->real_escape_string(POST['email']);
    //$query = "SELECT ac.id,CONCAT(ac.names,' ',ac.surnames) as name,ac.email,ac.password,ac.active,ac.role,rl.role as role_name FROM accounts AS ac LEFT JOIN roles as rl ON rl.id = ac.role WHERE email='".$email."'";
    $accounts = $DB->query("SELECT id,CONCAT(names,' ',surnames) as name,email,role,password,active FROM accounts WHERE email='".$email."'");

    if ($accounts->num_rows > 0) {
        $account = $accounts->fetch_object();
        if (password_verify(POST['password'], $account->password)) {
            if ($account->active === "1") {
                unset($account->password);
                unset($account->active);
                require '../jwt.php';
                $jwt = new JwtHandler();
                $account->token = $jwt->jwtEncodeData('AUTH', ['id'=>$account->id,'role'=>$account->role,'email'=> $account->email, 'iat' => 1356999524]);
                throwSuccess($account);
            } else {
                throwError(203, "Usuario no autorizado.");
            };
        } else {
            throwError(203, "Correo o Contraseña incorrectas.");
        }
    } else {
        throwError(203, "No se ha encontrado al usuario.");
    }
    $DB->close();
}
?>