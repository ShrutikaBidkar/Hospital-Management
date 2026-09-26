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


    // Required fields

    if (
        empty($data["doctor_code"]) ||
        empty($data["first_name"]) ||
        empty($data["specialization"]) ||
        empty($data["username"]) ||
        empty($data["password"])
    ) {

        echo json_encode([
            "success" => false,
            "message" => "Doctor code, first name, specialization, username and password are required"
        ]);

        exit;
    }


    $doctor_code =
        trim($data["doctor_code"]);

    $first_name =
        trim($data["first_name"]);

    $last_name =
        trim($data["last_name"] ?? "");

    $specialization =
        trim($data["specialization"]);

    $phone =
        trim($data["phone"] ?? "");

    $email =
        trim($data["email"] ?? "");

    $username =
        trim($data["username"]);

    $password =
        $data["password"];

    $department_id =
        !empty($data["department_id"])
        ? $data["department_id"]
        : null;


    // Check doctor code

    $check = $pdo->prepare(
        "SELECT id FROM doctors WHERE doctor_code = ?"
    );

    $check->execute([
        $doctor_code
    ]);


    if ($check->fetch()) {

        echo json_encode([
            "success" => false,
            "message" => "Doctor code already exists"
        ]);

        exit;
    }


    // Check username

    $check = $pdo->prepare(
        "SELECT id FROM doctors WHERE username = ?"
    );

    $check->execute([
        $username
    ]);


    if ($check->fetch()) {

        echo json_encode([
            "success" => false,
            "message" => "Doctor username already exists"
        ]);

        exit;
    }


    // Insert doctor

    $sql = "
        INSERT INTO doctors
        (
            doctor_code,
            first_name,
            last_name,
            specialization,
            phone,
            email,
            username,
            password,
            department_id
        )
        VALUES
        (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ";


    $stmt = $pdo->prepare($sql);


    $stmt->execute([

        $doctor_code,

        $first_name,

        $last_name,

        $specialization,

        $phone,

        $email,

        $username,

        $password,

        $department_id

    ]);


    echo json_encode([

        "success" => true,

        "message" =>
            "Doctor added successfully",

        "doctor_id" =>
            $pdo->lastInsertId()

    ]);


} catch (PDOException $e) {

    echo json_encode([

        "success" => false,

        "message" =>
            "Failed to add doctor",

        "error" =>
            $e->getMessage()

    ]);

}

?>