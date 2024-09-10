<?php
require '../headers.php';
require '../utils/general.php';

function clean($str) {
    $str = pathinfo($str, PATHINFO_FILENAME);
    $str = preg_replace('/\\s+/','_', $str);
    $str = preg_replace('/[^A-Za-z0-9_]/', '', $str);
    return preg_replace('/_+/','_', $str);
}

if (METHOD === 'POST') {
    require '../database.php';
    $upload = new stdClass();
    $upload->path = FOLDERSPATH;
    $upload->file = (object) $_FILES['file'];

    $folder = new stdClass();
    $folder->name = $DB->real_escape_string($_POST['folder']);
    $folder->path = $upload->path.'/'.$folder->name;
    
    $file = new stdClass();
    $file->id = $DB->real_escape_string($_POST['id']);
    $file->name = clean($upload->file->name);
    $file->type = pathinfo($upload->file->name, PATHINFO_EXTENSION);
    $file->size = $upload->file->size;
    $file->created = date('Y-m-d');
    $file->path = $folder->path.'/'.$file->id.'.'.$file->type;

    if (!file_exists($folder->path)) {
        mkdir($folder->path, 0777, true);
    }
    
    $uploaded = move_uploaded_file($upload->file->tmp_name, $file->path);

    if ($uploaded) {
        $query ="INSERT INTO files (`id`,`folder`,`name`,`type`,`size`) VALUES ('$file->id','$folder->name','$file->name','$file->type',$file->size)";
        $files = $DB->query($query);
        if ($DB->affected_rows > 0) {
            unset($file->path);
            throwSuccess($file);
        } else {
           throwError(203, "No se pudo crear el archivo");
        }
    }    
}

?>