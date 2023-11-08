<?php
require '../headers.php';
require '../utils.php';

if (METHOD === 'POST') {
    require '../database.php';
    $id = intval($DB->real_escape_string(POST['id']));
    $active = intval($DB->real_escape_string(POST['active'])) === 1 ? 0 : 1;
    $DB->query("UPDATE accounts SET active=".$active." WHERE id=".$id);
    
    $query = "SELECT ac.id,ac.names,ac.surnames,CONCAT(ac.names,' ',ac.surnames) AS full_name,ac.email,ac.role AS role_id,rl.label AS role_label,ac.active ";
    $query .= "FROM accounts AS ac ";
    $query .= "LEFT JOIN accounts_roles as rl ON ac.role=rl.id ";
    $query .= "ORDER BY ac.id DESC";
    $accounts = $DB->query($query);
    if ($accounts->num_rows > 0) {
            $rows=[];
            while($row=$accounts->fetch_object()){
                $row->role = ['id'=> $row->role_id,'label'=> $row->role_label];
                unset($row->role_id);
                unset($row->role_label);
                array_push($rows,$row);
            }
        echo json_encode($rows, JSON_NUMERIC_CHECK | JSON_BIGINT_AS_STRING);
    } else {
        throwError(404, "No users found");
    }
}
?>