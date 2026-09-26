<?php

function jsonResponse(
    $success,
    $data = null,
    $message = "",
    $status = 200
) {

    http_response_code($status);

    header("Content-Type: application/json");

    echo json_encode([
        "success" => $success,
        "data" => $data,
        "message" => $message
    ]);

    exit;
}

function getJsonInput()
{
    $input = file_get_contents("php://input");

    $data = json_decode($input, true);

    return is_array($data) ? $data : [];
}

?>