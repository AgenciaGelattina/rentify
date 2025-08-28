<?php
require '../../../headers.php';
require '../../../utils/general.php';

if (METHOD === 'GET') {
    require_once '../../../database.php';
    $property_id = intval($DB->real_escape_string($_GET['property']));
    $contract_id = intval($DB->real_escape_string($_GET['contract']));
    $query = "SELECT cmm.id,cmm.text,cmm.checked,cmm.created,JSON_OBJECT('id',acc.id,'fullName',CONCAT(acc.names,' ',acc.surnames)) AS account FROM comments AS cmm LEFT JOIN accounts AS acc ON acc.id = cmm.account WHERE cmm.property = $property_id AND cmm.contract = $contract_id ORDER BY cmm.id DESC";
    $comments_query = $DB->query($query);
    if ($comments_query->num_rows > 0) {
        $comments = [];
        while ($comment = $comments_query->fetch_object()) {
            $comment->account = json_decode($comment->account, true);
            array_push($comments, $comment);
        };
        throwSuccess($comments);
    } else {
        throwError(203, "No se encontraron comentarios para este contrato.");
    }
    $DB->close();
}
?>