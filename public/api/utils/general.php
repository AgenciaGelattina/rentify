<?php
define('PROTOCOL', $_SERVER['SERVER_PROTOCOL']);
define('METHOD', $_SERVER['REQUEST_METHOD']);
define('POST', json_decode(file_get_contents('php://input'), true));
define('ROOTPATH', $_SERVER['DOCUMENT_ROOT']);
define('FOLDERSPATH', $_SERVER['DOCUMENT_ROOT']."/rentify/test/assets/folders");
define('DOMAIN', "https://agenciagelattina.com/rentify");

$TIME_ZONE = new DateTimeZone("America/Mexico_City");

$now_time = new DateTime('now');
$NOW = new stdClass();
$NOW->time = $now_time;
$NOW->date = $now_time->format('Y-m-d');
$NOW->firs_day_month = $now_time->format('Y-m-').'01';
$NOW->last_day_month = $now_time->format('Y-m-t');

function addTMZero($strDate) {
    return $strDate."T00:00:00";
}

function getRowsArray($queryRows){
    $rows=[];
    while($row=$queryRows->fetch_object()){
        array_push($rows,$row);
    }
    return $rows;
}

function addZero($num) {
    return intval($num) < 10 ? '0'.$num : $num;
}

function getTotalMonths($start_date, $end_date) {
    $date1 = new DateTime($start_date);
    $date2 = new DateTime($end_date);
    $interval = $date1->diff($date2);
    if ($interval->d > 15) {
        return ($interval->y * 12) + ($interval->m + 1);
    } else {
        return ($interval->y * 12) + $interval->m;
    }
};

function getCurrentMonth($start_date) {
    $date1 = new DateTime($start_date);
    $now_time = new DateTime('now');
    $interval = $date1->diff($now_time);
    if ($interval->d > 0) {
        return ($interval->y * 12) + ($interval->m + 1);
    } else {
        return ($interval->y * 12) + $interval->m;
    }
}

function getTotalDays($start_date, $end_date) {
    $date1 = new DateTime($start_date);
    $date2 = new DateTime($end_date);
    $interval = $date1->diff($date2);
    return $interval->d;
};

function validateDueDate($start_date_time, $due_date) {
    $due_date_string = $start_date_time->format("Y-m")."-".$due_date;
    if (!checkdate($start_date_time->format("m"),$due_date,$start_date_time->format("Y"))) {
        return $start_date_time->format('Y-m-t');
    };
    return $due_date_string;
}
/*
function getPaymentType($recurring, $express) {
    if (!is_null($recurring)) {
        return "monthly";
    } else if (!is_null($express)) {
        return "unique";
    } else {
        return "extraordinary";
    }
}
*/
?>