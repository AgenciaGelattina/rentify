<?php
require '../../../headers.php';
require '../../../utils.php';

if (METHOD === 'POST') {
    require_once '../../../database.php';
    $id = intval($DB->real_escape_string(POST['id']));
    $contract = intval($DB->real_escape_string(POST['contract']));
    $names = $DB->real_escape_string(POST['names']);
    $surnames = $DB->real_escape_string(POST['surnames']);
    $email = $DB->real_escape_string(POST['email']);
    $phone = $DB->real_escape_string(POST['phone']);

    if ($id > 0) {
        $account = $DB->query("UPDATE contracts_contractors SET names='$names',surnames='$surnames',email='$email',phone='$phone' WHERE id=".$id); 
        if ($DB->affected_rows >= 0) {
            throwSuccess(true, "Se actualizaron los datos del inquilino.");          
        } else {
            throwError(203, "Error al guardar inquilino #$id");
        }
    } else {
        $query ="INSERT INTO contracts_contractors (`contract`,`names`,`surnames`,`email`,`phone`) VALUES ($contract,'$names','$surnames','$email','$phone')";
        $contractor = $DB->query($query);
        $newID = $DB->insert_id;
        if ($newID > 0) {
            throwSuccess(true, "El inquilino se agregó al contrato.");
        } else {
            throwError(203, "No se pudo gregar a el inquilino.");
        }
    }
    $DB->close();
}

if (METHOD === 'DELETE') {
    throwError(203, "SI SE PUEDE USAR ESTE METODO.");
}
?>