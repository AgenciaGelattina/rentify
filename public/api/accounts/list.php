<?php
require '../headers.php';
require '../utils/general.php';
require '../database.php';

if (METHOD === 'GET') {
    require '../database.php';
    $accounts = $DB->query("SELECT ac.id,ac.names,ac.surnames,JSON_OBJECT('id',acr.id,'label',acr.label) AS `role` FROM accounts AS ac LEFT JOIN accounts_roles AS acr ON acr.id = ac.role WHERE ac.role > 2");
    if ($accounts->num_rows > 0) {
        $rows = [];
        while($row=$accounts->fetch_object()){
            $row->role = json_decode($row->role);
            array_push($rows, $row);
        };
        throwSuccess($rows);
    } else {
        throwError(404, "No accounts found");
    }
}
?>