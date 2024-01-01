<?php
require '../headers.php';
require '../utils.php';

if (METHOD === 'GET') {
    require '../database.php';
    $folder = $DB->real_escape_string($_GET['folder']);
    $files = $DB->query("SELECT id,name,type,size,created FROM files WHERE folder = '$folder' ORDER BY created");

    function parseToFileStatus($queryRows){
        $rows=[];
        while($row=$queryRows->fetch_object()){
            $row->isUploading = false;
            $row->error = false;
            array_push($rows,$row);
        }
        return $rows;
    }

    throwSuccess(parseToFileStatus($files));
}
?>