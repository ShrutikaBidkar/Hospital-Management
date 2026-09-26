<?php

header("Content-Type: application/json; charset=UTF-8");

$rootConfig = dirname(__DIR__, 2) . DIRECTORY_SEPARATOR . "config" . DIRECTORY_SEPARATOR . "database.php";
$backendConfig = dirname(__DIR__) . DIRECTORY_SEPARATOR . "config" . DIRECTORY_SEPARATOR . "database.php";

if (file_exists($rootConfig)) {
    require_once $rootConfig;
} elseif (file_exists($backendConfig)) {
    require_once $backendConfig;
} else {
    echo json_encode([
        "success" => false,
        "message" => "database.php not found"
    ]);
    exit;
}

try {

    $data = json_decode(file_get_contents("php://input"), true);

    if (!is_array($data)) {
        echo json_encode([
            "success" => false,
            "message" => "Invalid JSON data"
        ]);
        exit;
    }

    if (!isset($data["id"]) || empty($data["id"])) {
        echo json_encode([
            "success" => false,
            "message" => "Doctor ID is required"
        ]);
        exit;
    }

    $id = intval($data["id"]);

    // Check doctor exists
    $check = $pdo->prepare(
        "SELECT id FROM doctors WHERE id = ?"
    );

    $check->execute([$id]);

    if (!$check->fetch(PDO::FETCH_ASSOC)) {
        echo json_encode([
            "success" => false,
            "message" => "Doctor not found"
        ]);
        exit;
    }

    // SOFT DELETE
    $stmt = $pdo->prepare(
        "UPDATE doctors SET status = 'Inactive' WHERE id = ?"
    );

    $stmt->execute([$id]);

    echo json_encode([
        "success" => true,
        "message" => "Doctor deleted successfully"
    ]);
    exit;

} catch (PDOException $e) {

    echo json_encode([
        "success" => false,
        "message" => "Failed to delete doctor",
        "error" => $e->getMessage()
    ]);
    exit;

} catch (Exception $e) {

    echo json_encode([
        "success" => false,
        "message" => "Server error",
        "error" => $e->getMessage()
    ]);
    exit;
}

?>