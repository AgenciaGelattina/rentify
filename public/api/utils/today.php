<?php
$today_time = new DateTime('now');

$today = new stdClass();
$today->time = $today_time;
$today->firs_day_month = $today_time->modify('first day of this month');
$today->last_day_month = $today_time->modify('last day of this month');
?>