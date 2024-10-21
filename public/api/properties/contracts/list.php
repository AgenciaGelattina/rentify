<?php
require '../../headers.php';
require '../../utils/general.php';
require '../../utils/constants.php';
require '../../utils/today.php';
require '../../database.php';

if (METHOD === 'GET') {
    $property = intval($DB->real_escape_string($_GET['property_id']));
    $type = $DB->real_escape_string($_GET['type']);

    $query = "SELECT id,property,due_date,start_date,end_date,canceled,finalized FROM property_contracts WHERE property = $property";
    
    if ($type === "expired") {
        $query .= " AND (canceled = 1 OR start_date <= CURDATE() AND end_date < CURDATE()) AND finalized = 0";
    } else if ($type === "finalized") {
        $query .= " AND finalized = 1";
    }

    $contract_result = $DB->query($query);
    
    $contracts = [];
    if ($contract_result->num_rows > 0) {
        while($row = $contract_result->fetch_object()) {

            // CONTRACT
            $contract = new stdClass();
            $contract->id = $row->id;
            $contract->start_date = $row->start_date."T00:00:00";
            $contract->end_date = $row->end_date."T00:00:00";
            $contract->canceled = $row->canceled == 0 ? false : true;
            $contract->finalized = $row->finalized == 0 ? false : true;
           
            array_push($contracts, $contract);
        }
        throwSuccess($contracts);
    } else {
        throwSuccess([]);
    }
    $DB->close();
}