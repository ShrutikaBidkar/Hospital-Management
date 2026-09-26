<?php

session_start();

function requireLogin()
{
    if (!isset($_SESSION["user"])) {

        http_response_code(401);

        header("Content-Type: application/json");

        echo json_encode([
            "success" => false,
            "message" => "Please login first."
        ]);

        exit;
    }
}

?>