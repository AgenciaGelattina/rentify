<?php
require '../headers.php';
require '../utils.php';

if (METHOD === 'POST') {
    require '../database.php';
    $upload->path = ROOTPATH.'/rentify/assets/folders';
    $upload->file = (object) $_FILES['file'];

    $folder->name = $DB->real_escape_string($_POST['folder']);
    $folder->path = $upload->path.'/'.$folder->name;
    
    $file->id = $DB->real_escape_string($_POST['id']);
    $file->name = $upload->file->name;
    $file->type = pathinfo($upload->file->name, PATHINFO_EXTENSION);
    $file->size = $upload->file->size;
    $file->path = $folder->path.'/'.$file->id.'.'.$file->type;
    $file->url = la URL de descarga

    if (!file_exists($folder->path)) {
        mkdir($folder->path, 0777, true);
    }
    
    $uploaded = move_uploaded_file($upload->file->tmp_name, $file->path);

    echo json_encode(['up'=> $upload, 'fd'=>$folder, 'file'=>$file]);
}

?>