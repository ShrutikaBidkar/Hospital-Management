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
        empty($data["id"]) ||
        empty($data["department_name"])
    ) {

        echo json_encode([
            "success" => false,
            "message" => "Department ID and department name are required"
        ]);

        exit;
    }


    $id = intval($data["id"]);

    $department_name =
        trim($data["department_name"]);

    $description =
        trim($data["description"] ?? "");


    // Check department exists
    $checkDepartment = $pdo->prepare(
        "SELECT id
         FROM departments
         WHERE id = ?"
    );

    $checkDepartment->execute([$id]);


    if (!$checkDepartment->fetch()) {

        echo json_encode([
            "success" => false,
            "message" => "Department not found"
        ]);

        exit;
    }


    // Check duplicate department name
    $checkName = $pdo->prepare(
        "SELECT id
         FROM departments
         WHERE department_name = ?
         AND id != ?"
    );

    $checkName->execute([
        $department_name,
        $id
    ]);


    if ($checkName->fetch()) {

        echo json_encode([
            "success" => false,
            "message" => "Department name already exists"
        ]);

        exit;
    }


    // Update department
    $sql = "UPDATE departments
            SET department_name = ?,
                description = ?
            WHERE id = ?";

    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        $department_name,
        $description,
        $id
    ]);


    echo json_encode([
        "success" => true,
        "message" => "Department updated successfully"
    ]);


} catch (PDOException $e) {

    echo json_encode([
        "success" => false,
        "message" => "Failed to update department",
        "error" => $e->getMessage()
    ]);

}

?>