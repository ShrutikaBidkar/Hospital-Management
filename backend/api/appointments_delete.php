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


    if (empty($data["id"])) {

        echo json_encode([
            "success" => false,
            "message" => "Appointment ID is required"
        ]);

        exit;
    }


    $id = intval($data["id"]);


    // Check appointment

    $check = $pdo->prepare(
        "SELECT id FROM appointments WHERE id = ?"
    );

    $check->execute([
        $id
    ]);


    if (!$check->fetch()) {

        echo json_encode([
            "success" => false,
            "message" => "Appointment not found"
        ]);

        exit;
    }


    // Delete appointment

    $stmt = $pdo->prepare(
        "DELETE FROM appointments WHERE id = ?"
    );

    $stmt->execute([
        $id
    ]);


    echo json_encode([
        "success" => true,
        "message" => "Appointment deleted successfully"
    ]);

} catch (PDOException $e) {

    echo json_encode([
        "success" => false,
        "message" => "Failed to delete appointment",
        "error" => $e->getMessage()
    ]);

}

?>