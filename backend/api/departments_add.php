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


    if (empty($data["department_name"])) {

        echo json_encode([
            "success" => false,
            "message" => "Department name is required"
        ]);

        exit;
    }


    $department_name =
        trim($data["department_name"]);

    $description =
        trim($data["description"] ?? "");


    // Check duplicate department
    $check = $pdo->prepare(
        "SELECT id
         FROM departments
         WHERE department_name = ?"
    );

    $check->execute([
        $department_name
    ]);


    if ($check->fetch()) {

        echo json_encode([
            "success" => false,
            "message" => "Department already exists"
        ]);

        exit;
    }


    // Insert department
    $sql = "INSERT INTO departments
            (department_name, description)
            VALUES (?, ?)";

    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        $department_name,
        $description
    ]);


    echo json_encode([
        "success" => true,
        "message" => "Department added successfully",
        "department_id" => $pdo->lastInsertId()
    ]);


} catch (PDOException $e) {

    echo json_encode([
        "success" => false,
        "message" => "Failed to add department",
        "error" => $e->getMessage()
    ]);

}

?>