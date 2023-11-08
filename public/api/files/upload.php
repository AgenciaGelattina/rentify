<?php
require '../headers.php';
require '../utils.php';



if (METHOD === 'POST') {
    require '../database.php';
    $upload->path = ROOTPATH.'/rentify/assets/folders';
    $upload->file = $_FILES['file'];

    $folder->name = $DB->real_escape_string($_POST['folder']);
    $folder->path = $upload_path.'/'.$folder->name;
    
    $file->id = $DB->real_escape_string($_POST['id']);
    $file->name = $upload->file['name'];
    $file->type = pathinfo($upload->file['name'], PATHINFO_EXTENSION);
    $file->path = $folder->path.'/'.$file->id.'.'.$file->type;

    if (!file_exists($folder->path)) {
        mkdir($folder->path, 0777, true);
    }
    
    $uploaded = move_uploaded_file($upload->file['tmp_name'], $file->path);
   
    echo json_encode(['file'=> $file]);
}

?>