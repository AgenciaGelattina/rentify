<?php
require '../headers.php';
require '../utils/general.php';

if (METHOD === 'GET' && isset($_GET['token'])) {
    require '../jwt.php';
    try {
        $jwt = new JwtHandler();
        $user = $jwt->jwtDecodeData($_GET['token']);
        if(isset($user->id)) {
            require '../database.php';
            $accounts = $DB->query("SELECT id,CONCAT(names,' ',surnames) as name,email,role FROM accounts WHERE id=$user->id AND active=1");
            if ($accounts->num_rows > 0) {
                $account = $accounts->fetch_object();
                $account->token = $jwt->jwtEncodeData('AUTH', ['id'=>$account->id,'role'=>$account->role,'email'=> $account->email, 'iat' => 1356999524]);
                throwSuccess($account, "Autentificación por Token!");
            } else {
                throwError(203, "Usuario no autorizado.");
            };
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