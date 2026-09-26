<?php

header("Content-Type: application/json");

require_once "../config/database.php";

try {

    $sql = "
        SELECT 
            id AS user_id,
            username,
            'Admin' AS role,
            created_at
        FROM admin

        UNION ALL

        SELECT 
            id AS user_id,
            username,
            'Nurse' AS role,
            created_at
        FROM nurse

        ORDER BY user_id ASC
    ";

    $stmt = $pdo->query($sql);

    $users = $stmt->fetchAll();

    echo json_encode([
        "success" => true,
        "data" => $users
    ]);

} catch (PDOException $e) {

    echo json_encode([
        "success" => false,
        "message" => "Failed to load users",
        "error" => $e->getMessage()
    ]);

}

?>