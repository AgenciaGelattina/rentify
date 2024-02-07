<?php
require '../../headers.php';
require '../../utils.php';
require '../../database.php';

if (METHOD === 'GET') {
    $contract_id = intval($DB->real_escape_string($_GET['contract_id']));
    $query = "SELECT cf.name,cf.title,cf.description,(SELECT COUNT(fl.id) FROM files AS fl WHERE fl.folder = cf.name) as num_files FROM contracts_folders AS cf WHERE cf.contract = ".$contract_id;
    $contract_result = $DB->query($query);
    throwSuccess(getRowsArray($contract_result));
    $DB->close();
}

?>