<?php
require '../utils/general.php';

if (METHOD === 'GET' && isset($_GET['file'])) {
    require '../database.php';
    $file_id = $DB->real_escape_string($_GET['file']);
    $file = $DB->query("SELECT id,folder,name,type,size,created FROM contracts_folders_files WHERE id = '$file_id'");
    if ($file->num_rows > 0) {
        $fileData = $file->fetch_object();
        $file_path = FOLDERSPATH."/$fileData->folder/$fileData->id.$fileData->type";
        header("Content-Type: application/octet-stream");
        header("Content-Transfer-Encoding: Binary");
        header("Content-disposition: attachment; filename=\"$fileData->name.$fileData->type\""); 
        set_time_limit(0);
        echo $file_path;
        $file = @fopen($file_path,"rb");
        while(!feof($file))
        {
            print(@fread($file, 1024*8));
            ob_flush();
            flush();
        }
    }
    $DB->close();
}
?>