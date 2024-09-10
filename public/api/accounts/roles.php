<?php
require '../headers.php';
require '../utils/general.php';

if (METHOD === 'GET') {
    require '../database.php';
    $roles = $DB->query("SELECT id,label FROM accounts_roles");
    if ($roles->num_rows > 0) {
        echo json_encode(getRowsArray($roles), JSON_NUMERIC_CHECK | JSON_BIGINT_AS_STRING);
    } else {
        throwError(404, "No roles found");
    }
}
?>