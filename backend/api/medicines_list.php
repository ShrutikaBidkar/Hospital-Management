<?php

header("Content-Type: application/json");

require_once "../config/database.php";

try {

    $sql = "
        SELECT
            id,
            medicine_name,
            category,
            manufacturer,
            quantity,
            price,
            expiry_date,
            created_at
        FROM medicines
        ORDER BY id ASC
    ";

    $stmt = $pdo->query($sql);

    $medicines = $stmt->fetchAll();

    echo json_encode([
        "success" => true,
        "data" => $medicines
    ]);

} catch (PDOException $e) {

    echo json_encode([
        "success" => false,
        "message" => "Failed to load medicines",
        "error" => $e->getMessage()
    ]);

}

?>