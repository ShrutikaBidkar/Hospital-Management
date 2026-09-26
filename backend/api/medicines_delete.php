<?php

header("Content-Type: application/json");

require_once "../config/database.php";

try {

    $data = json_decode(
        file_get_contents("php://input"),
        true
    );

    if (!$data || empty($data["id"])) {

        echo json_encode([
            "success" => false,
            "message" => "Medicine ID is required"
        ]);

        exit;
    }


    $id = intval($data["id"]);


    /* Check Medicine */

    $check = $pdo->prepare(
        "SELECT id FROM medicines WHERE id = ?"
    );

    $check->execute([$id]);

    if (!$check->fetch()) {

        echo json_encode([
            "success" => false,
            "message" => "Medicine not found"
        ]);

        exit;
    }


    /* Delete Medicine */

    $stmt = $pdo->prepare(
        "DELETE FROM medicines WHERE id = ?"
    );

    $stmt->execute([$id]);


    echo json_encode([
        "success" => true,
        "message" => "Medicine deleted successfully"
    ]);

} catch (PDOException $e) {

    echo json_encode([
        "success" => false,
        "message" => "Failed to delete medicine",
        "error" => $e->getMessage()
    ]);

}

?>