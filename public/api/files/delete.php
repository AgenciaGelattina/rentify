<?php
require '../headers.php';
require '../utils.php';

if (METHOD === 'POST') {
    require '../database.php';
    $file_id = $DB->real_escape_string(POST['file_id']);
    $folder = $DB->real_escape_string(POST['folder']);
    
    $DB->query("DELETE FROM files WHERE id = '$file_id' AND folder = '$folder'");
    if ($DB->affected_rows > 0) {
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

        throwSuccess(parseToFileStatus($files), "El archivo #$file_id, se ha borrado!.");
    } else {
        throwError(203, "No se pudo borrar el archivo #$file_id");
    }
    $DB->close();
}
?>