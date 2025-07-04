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
            //$accounts = $DB->query("SELECT id,CONCAT(names,' ',surnames) as name,email,role FROM accounts WHERE id=$user->id AND active=1");
            $accounts = $DB->query("SELECT ac.id,ac.names,ac.surnames,CONCAT(ac.names,' ',ac.surnames) as fullName,ac.email,JSON_OBJECT('id',acr.id,'label',acr.label) AS role FROM accounts AS ac LEFT JOIN accounts_roles AS acr ON acr.id = ac.role WHERE ac.id=$user->id AND ac.active=1");
            if ($accounts->num_rows > 0) {
                $account = $accounts->fetch_object();
                $account->role = json_decode($account->role, true);
                $account->token = $jwt->jwtEncodeData('AUTH', ['id'=>$account->id,'role'=>$account->role,'email'=> $account->email, 'iat' => $NOW->time]);
                throwSuccess($account, "Token Autorizado.");
            } else {
                throwError(203, "Usuario no Autorizado.");
            };
            $DB->close();
        } else {
            throwError(203, "Token no Autorizado.");
        }
    } catch(Exception $e) {
        throwError(203, $e->getMessage());
    }
} else {
    throwError(203, "No Autorizado!.");
}

?>