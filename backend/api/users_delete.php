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


    $id = intval($data["id"] ?? 0);
    $role = $data["role"] ?? "";


    if (empty($id) || empty($role)) {

        echo json_encode([
            "success" => false,
            "message" => "User ID and role are required"
        ]);

        exit;
    }


    if ($role !== "Admin" && $role !== "Nurse") {

        echo json_encode([
            "success" => false,
            "message" => "Invalid role"
        ]);

        exit;
    }


    $table = ($role === "Admin")
        ? "admin"
        : "nurse";


    /* Check user */

    $check = $pdo->prepare(
        "SELECT id FROM $table WHERE id = ?"
    );

    $check->execute([$id]);


    if (!$check->fetch()) {

        echo json_encode([
            "success" => false,
            "message" => "User not found"
        ]);

        exit;
    }


    /* Delete */

    $stmt = $pdo->prepare(
        "DELETE FROM $table WHERE id = ?"
    );

    $stmt->execute([$id]);


    echo json_encode([
        "success" => true,
        "message" => "User deleted successfully"
    ]);


} catch (PDOException $e) {

    echo json_encode([
        "success" => false,
        "message" => "Failed to delete user",
        "error" => $e->getMessage()
    ]);

}

?>