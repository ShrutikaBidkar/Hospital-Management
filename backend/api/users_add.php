<?php

header("Content-Type: application/json");

require_once "../config/database.php";

try {

    $data = json_decode(
        file_get_contents("php://input"),
        true
    );

    if (!$data) {

        echo json_encode([
            "success" => false,
            "message" => "Invalid JSON data"
        ]);

        exit;
    }


    $username = trim($data["username"] ?? "");
    $password = $data["password"] ?? "";
    $role = $data["role"] ?? "";


    if (empty($username) || empty($password) || empty($role)) {

        echo json_encode([
            "success" => false,
            "message" => "Username, password and role are required"
        ]);

        exit;
    }


    /* Allow only Admin or Nurse */

    if ($role !== "Admin" && $role !== "Nurse") {

        echo json_encode([
            "success" => false,
            "message" => "Invalid role"
        ]);

        exit;
    }


    /* Check username in Admin table */

    $checkAdmin = $pdo->prepare(
        "SELECT id FROM admin WHERE username = ?"
    );

    $checkAdmin->execute([$username]);


    if ($checkAdmin->fetch()) {

        echo json_encode([
            "success" => false,
            "message" => "Username already exists"
        ]);

        exit;
    }


    /* Check username in Nurse table */

    $checkNurse = $pdo->prepare(
        "SELECT id FROM nurse WHERE username = ?"
    );

    $checkNurse->execute([$username]);


    if ($checkNurse->fetch()) {

        echo json_encode([
            "success" => false,
            "message" => "Username already exists"
        ]);

        exit;
    }


    /* Hash password */

    $hashedPassword = password_hash(
        $password,
        PASSWORD_DEFAULT
    );


    /* Insert according to role */

    if ($role === "Admin") {

        $stmt = $pdo->prepare(
            "INSERT INTO admin (username, password)
             VALUES (?, ?)"
        );

    } else {

        $stmt = $pdo->prepare(
            "INSERT INTO nurse (username, password)
             VALUES (?, ?)"
        );
    }


    $stmt->execute([
        $username,
        $hashedPassword
    ]);


    echo json_encode([
        "success" => true,
        "message" => "User added successfully",
        "user_id" => $pdo->lastInsertId()
    ]);


} catch (PDOException $e) {

    echo json_encode([
        "success" => false,
        "message" => "Failed to add user",
        "error" => $e->getMessage()
    ]);

}

?>