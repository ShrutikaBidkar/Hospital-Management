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


    // Check ID
    if (empty($data["id"])) {

        echo json_encode([
            "success" => false,
            "message" => "Department ID is required"
        ]);

        exit;
    }


    $id = intval($data["id"]);


    // Check department exists
    $check = $pdo->prepare(
        "SELECT id
         FROM departments
         WHERE id = ?"
    );

    $check->execute([$id]);


    if (!$check->fetch()) {

        echo json_encode([
            "success" => false,
            "message" => "Department not found"
        ]);

        exit;
    }


    // Delete department
    $stmt = $pdo->prepare(
        "DELETE FROM departments
         WHERE id = ?"
    );

    $stmt->execute([$id]);


    echo json_encode([
        "success" => true,
        "message" => "Department deleted successfully"
    ]);


} catch (PDOException $e) {

    echo json_encode([
        "success" => false,
        "message" => "Failed to delete department",
        "error" => $e->getMessage()
    ]);

}

?>