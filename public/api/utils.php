<?php
define('PROTOCOL', $_SERVER['SERVER_PROTOCOL']);
define('METHOD', $_SERVER['REQUEST_METHOD']);
define('POST', json_decode(file_get_contents('php://input'), true));
define('ROOTPATH', $_SERVER['DOCUMENT_ROOT']);
define('FOLDERSPATH', $_SERVER['DOCUMENT_ROOT']."/rentify/dev/assets/folders");
define('DOMAIN', "https://agenciagelattina.com/rentify/dev");

function getRowsArray($queryRows){
    $rows=[];
    while($row=$queryRows->fetch_object()){
        array_push($rows,$row);
    }
    return $rows;
}
?>