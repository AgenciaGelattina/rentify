<?php
require '../../jwt.php';
$password = password_hash($_GET['password'], PASSWORD_BCRYPT);
echo $password;
?>