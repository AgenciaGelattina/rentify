<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST'); 
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Headers: Content-Type');
header("Content-type: application/json; charset=utf-8");

function throwError($code = "203", $message = '') {
    header("Status: $code ".$message);
    echo json_encode(['error'=> ['status'=> $code, 'message'=> $message]]);
}

function throwSuccess($data = null, $message = '') {
    echo json_encode(['success'=> ['data' => $data, 'message'=> $message]], JSON_NUMERIC_CHECK | JSON_BIGINT_AS_STRING);
}
?>