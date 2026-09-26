<?php

session_start();

header("Content-Type: application/json");


if (isset($_SESSION["user"])) {

    echo json_encode([

        "success" => true,

        "logged_in" => true,

        "user" => $_SESSION["user"]

    ]);

} else {

    echo json_encode([

        "success" => true,

        "logged_in" => false,

        "user" => null

    ]);

}

?>