<?php
require '../headers.php';
require '../utils/general.php';

if (METHOD === 'POST') {
    require '../database.php';
    $file_id = $DB->real_escape_string(POST['file_id']);
    $file_type = $DB->real_escape_string(POST['file_type']);
    $folder = $DB->real_escape_string(POST['folder']);
    
    $file_name = $file_id.'.'.$file_type;
    $deleted = unlink(FOLDERSPATH.'/'.$folder.'/'.$file_name);
    if ($deleted) {
        $DB->query("DELETE FROM contracts_folders_files WHERE id = '$file_id' AND folder = '$folder'");
        if ($DB->affected_rows > 0) {
            $files = $DB->query("SELECT id,name,type,size,created FROM contracts_folders_files WHERE folder = '$folder' ORDER BY created");
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
    } else {
        throwError(203, "No se pudo borrar el archivo $file_name");
    }
    $DB->close();
}
?>