<?php
$DB = new mysqli("localhost","Rentify","R3nt1fy$#23","Rentify_DevB");
if($DB->connect_errno){
    printf("Connect failed: %s\n", $DB->connect_error);
    exit();
}else{
	date_default_timezone_set('America/Mexico_City');
	$DB->set_charset("utf8");
}

/*
//PROPERTIES
$properties = $DB->query("SELECT `id`,`type`,`status`,`group`,`title`,`description`,`created`,`active` FROM properties");
echo "<pre>";
echo "INSERT INTO `properties` (`id`, `type`, `status`, `group`, `title`, `description`, `created`, `active`) VALUES <br>";
while($row=$properties->fetch_object()){
    echo "($row->id, $row->type, $row->status, $row->group, '$row->title', '$row->description', '$row->created', $row->active), <br>";
};
echo "-----------------------------------";
echo "</pre>";
*/
/*
//CONTRACTS
$properties = $DB->query("SELECT `id`,`property`,`due_date`,`start_date`,`end_date`,`created` FROM `property_contracts`");
echo "<pre>";
echo "INSERT INTO `property_contracts` (`id`,`property`,`due_date`,`start_date`,`end_date`,`created`,`active`) VALUES <br>";
while($row=$properties->fetch_object()){
    echo "($row->id, $row->property, $row->due_date, '$row->start_date', '$row->end_date', '$row->created', 1), <br>";
};
echo "-----------------------------------";
echo "</pre>";
*/
/*
//RECURRINGS 
$properties = $DB->query("SELECT `id`,`value`,`start_date`,`end_date` FROM `property_contracts`;");
echo "<pre>";
echo "INSERT INTO `contracts_recurring_payments` (`id`,`contract`,`label`,`value`,`start_date`,`end_date`) VALUES <br>";
$num = 1;
while($row=$properties->fetch_object()){
    echo "($num, $row->id, 'Renta', $row->value,'$row->start_date', '$row->end_date'), <br>";
    $num += 1;
};
echo "-----------------------------------";
echo "</pre>";
*/
//MIGRATION
$fields = "`id`, `property`, `due_date`, `start_date`, `end_date`, `active`";
$table = "property_contracts";

$table_query = $DB->query("SELECT $fields FROM $table");
echo "<pre>";
echo "INSERT INTO $table (`id`, `property`, `due_date`, `start_date`, `end_date`, `canceled`, `finalized`) VALUES <br>";
while($row=$table_query->fetch_object()){
    $canceled = $row->active == 1 ? 0 : 1;
    echo "($row->id, $row->property, $row->due_date, '$row->start_date', '$row->end_date', $canceled, 0), <br>";
};
echo "-----------------------------------";
echo "</pre>";
$DB->close();
?>