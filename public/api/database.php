<?php
$DB = new mysqli("localhost","Rentify","R3nt1fy$#23","Rentify");
if($DB->connect_errno){
    printf("Connect failed: %s\n", $DB->connect_error);
    exit();
}else{
	date_default_timezone_set('America/Mexico_City');
	$DB->set_charset("utf8");
}
?>