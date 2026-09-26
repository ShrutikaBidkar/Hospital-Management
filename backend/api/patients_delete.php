<?php

header("Content-Type: application/json; charset=UTF-8");

// --------------------------------------------------
// Find database.php automatically
// --------------------------------------------------

$rootConfig = dirname(__DIR__, 2) . DIRECTORY_SEPARATOR . "config" . DIRECTORY_SEPARATOR . "database.php";
$backendConfig = dirname(__DIR__) . DIRECTORY_SEPARATOR . "config" . DIRECTORY_SEPARATOR . "database.php";

if (file_exists($rootConfig)) {
    require_once $rootConfig;
} elseif (file_exists($backendConfig)) {
    require_once $backendConfig;
} else {
    echo json_encode([
        "success" => false,
        "message" => "database.php not found",
        "checked_paths" => [
            $rootConfig,
            $backendConfig
        ]
    ]);
    exit;
}

try {

    // Get JSON data from JavaScript
    $input = file_get_contents("php://input");
    $data = json_decode($input, true);

    // Check JSON
    if (!is_array($data)) {
        echo json_encode([
            "success" => false,
            "message" => "Invalid JSON data"
        ]);
        exit;
    }

    // Check patient ID
    if (!isset($data["id"]) || empty($data["id"])) {
        echo json_encode([
            "success" => false,
            "message" => "Patient ID is required"
        ]);
        exit;
    }

    $id = intval($data["id"]);

    // Check patient exists
    $check = $pdo->prepare(
        "SELECT id FROM patients WHERE id = ?"
    );

    $check->execute([$id]);

    if (!$check->fetch(PDO::FETCH_ASSOC)) {
        echo json_encode([
            "success" => false,
            "message" => "Patient not found"
        ]);
        exit;
    }

    // Delete patient
    $stmt = $pdo->prepare(
        "DELETE FROM patients WHERE id = ?"
    );

    $stmt->execute([$id]);

    echo json_encode([
        "success" => true,
        "message" => "Patient deleted successfully",
        "id" => $id
    ]);
    exit;

} catch (PDOException $e) {

    echo json_encode([
        "success" => false,
        "message" => "Failed to delete patient",
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