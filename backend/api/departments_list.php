<?php

header("Content-Type: application/json");

require_once "../config/database.php";

try {

    $sql = "SELECT
                id,
                department_name,
                description,
                created_at
            FROM departments
            ORDER BY id ASC";

    $stmt = $pdo->prepare($sql);
    $stmt->execute();

    $departments = $stmt->fetchAll();

    echo json_encode([
        "success" => true,
        "data" => $departments
    ]);

} catch (PDOException $e) {

    echo json_encode([
        "success" => false,
        "message" => "Failed to fetch departments",
        "error" => $e->getMessage()
    ]);

}

?>