<?php
require '../utils/general.php';
$DB = new mysqli("localhost","Rentify","R3nt1fy$#23","Rentify_TestB");
if($DB->connect_errno){
    printf("Connect failed: %s\n", $DB->connect_error);
    exit();
}else{
    date_default_timezone_set('America/Mexico_City');
    $DB->set_charset("utf8");
}

// CHARGES
$query_select = $DB->query("SELECT * FROM `contracts_recurring_charges` WHERE FIND_IN_SET(contract,'32,54,55,56,72,80,98')");

$query_insert = "INSERT INTO `contracts_express_charges` (`contract`,`label`,`value`,`canceled`) VALUES <br>";
$query_values = [];
while ($row=$query_select->fetch_object()) {
    array_push($query_values, "($row->contract,'$row->label',$row->value,0)");
};
echo $query_insert .= implode(",", $query_values).";";
echo "</pre>";
/*
//CONTRACTS
$query_select = $DB->query("SELECT `id`, `property`, `due_date`, `start_date`, `end_date`, `in_date`, `out_date`, `currency`, `canceled`, `finalized` FROM `property_contracts`");
echo "<pre>";

$query_insert = "INSERT INTO `property_contracts` (`id`,`property`,`type`,`due_date`,`start_date`,`end_date`,`in_date`,`out_date`,`currency`,`canceled`,`finalized`) VALUES <br>";
$query_values = [];
while($row=$query_select->fetch_object()){
    echo '<br>Contract_ID: '.$row->id;
    echo '<br>TotalMonth: '.getTotalMonths($row->start_date, $row->end_date);
    echo '<br>TotalDays: '.getTotalDays($row->start_date, $row->end_date);
    echo '<br>----------------------------------------';
    //array_push($query_values, "($row->id, $row->property,'recurring',$row->due_date, '$row->start_date', '$row->end_date', '$row->start_date', '$row->end_date', 'mxn', $row->canceled, $row->finalized)");
};
//echo $query_insert .= implode(",", $query_values).";";
echo "-----------------------------------";
echo "</pre>";

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




/*
//RECURRINGS 
$properties = $DB->query("SELECT `id`,`value`,`start_date`,`end_date` FROM `property_contracts`;");
echo "<pre>";
echo "INSERT INTO `contracts_recurring_charges` (`id`,`contract`,`label`,`value`,`start_date`,`end_date`) VALUES <br>";
$num = 1;
while($row=$properties->fetch_object()){
    echo "($num, $row->id, 'Renta', $row->value,'$row->start_date', '$row->end_date'), <br>";
    $num += 1;
};
echo "-----------------------------------";
echo "</pre>";


//PAYMENTS 
$payments = $DB->query("SELECT `id`,`contract`,`recurring`,`type`,`amount`,`date`,`clarifications` FROM `contracts_payments`");
echo "<pre>";
echo "INSERT INTO `contracts_payments` (`id`,`contract`,`recurring`,`express`,`amount`,`date`,`clarifications`) VALUES <br>";
while($row=$payments->fetch_object()){
    echo "($row->id,$row->contract,$row->recurring,0,$row->amount,'$row->date','$row->clarifications'),<br>";
};
echo "-----------------------------------";
echo "</pre>";
*/
$DB->close();
?>