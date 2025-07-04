<?php
require '../headers.php';
require '../utils/general.php';

if (METHOD === 'POST') {
    require '../database.php';
    $email = $DB->real_escape_string(POST['email']);
    
    //$accounts = $DB->query("SELECT id,CONCAT(names,' ',surnames) as name,email,role,password,active FROM accounts WHERE email='".$email."'");
    $accounts = $DB->query("SELECT ac.id,ac.names,ac.surnames,CONCAT(ac.names,' ',ac.surnames) as fullName,ac.email,JSON_OBJECT('id',acr.id,'label',acr.label) AS role,ac.password,ac.active FROM accounts AS ac LEFT JOIN accounts_roles AS acr ON acr.id = ac.role WHERE ac.email='$email'");

    if ($accounts->num_rows > 0) {
        $account = $accounts->fetch_object();
        if (password_verify(POST['password'], $account->password)) {
            if ($account->active === "1") {
                $account->role = json_decode($account->role, true);
                unset($account->password);
                unset($account->active);
                require '../jwt.php';
                $jwt = new JwtHandler();
                $account->token = $jwt->jwtEncodeData('AUTH', ['id'=>$account->id,'role'=>$account->role,'email'=> $account->email, 'iat' => $NOW->time]);
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