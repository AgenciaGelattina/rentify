<?php
// PROPERTY
$property = new stdClass();
$row = $property_result->fetch_object();
$property->id = $row->property_id;
$property->title = $row->property_title;
$property->description = $row->property_description;
$property->active_contract = null;
$property->group = json_decode($row->property_group, true);
$property->type = json_decode($row->property_type, true);
$property->status = json_decode($row->property_status, true);
?>