<?php

header("Content-Type: application/json; charset=UTF-8");

// Database path
$databasePath = dirname(__DIR__) . "/config/database.php";

if (!file_exists($databasePath)) {
    echo json_encode([
        "success" => false,
        "message" => "database.php not found",
        "path" => $databasePath
    ]);
    exit;
}

require_once $databasePath;

try {

    // Get JSON data
    $input = file_get_contents("php://input");
    $data = json_decode($input, true);

    if (!is_array($data)) {
        echo json_encode([
            "success" => false,
            "message" => "Invalid JSON data"
        ]);
        exit;
    }

    // Patient ID
    if (!isset($data["id"]) || empty($data["id"])) {
        echo json_encode([
            "success" => false,
            "message" => "Patient ID is required"
        ]);
        exit;
    }

    $id = intval($data["id"]);

    // Get patient data
    $patient_code = trim($data["patient_code"] ?? "");
    $first_name = trim($data["first_name"] ?? "");
    $last_name = trim($data["last_name"] ?? "");
    $gender = $data["gender"] ?? "";
    $date_of_birth = $data["date_of_birth"] ?? "";
    $phone = trim($data["phone"] ?? "");
    $email = trim($data["email"] ?? "");
    $blood_group = $data["blood_group"] ?? "";
    $emergency_contact = trim($data["emergency_contact"] ?? "");
    $address = trim($data["address"] ?? "");

    // Required fields
    if ($patient_code === "" || $first_name === "") {
        echo json_encode([
            "success" => false,
            "message" => "Patient Code and First Name are required"
        ]);
        exit;
    }

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

    // Update patient
    $sql = "
        UPDATE patients SET
            patient_code = ?,
            first_name = ?,
            last_name = ?,
            gender = ?,
            date_of_birth = ?,
            phone = ?,
            email = ?,
            blood_group = ?,
            emergency_contact = ?,
            address = ?
        WHERE id = ?
    ";

    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        $patient_code,
        $first_name,
        $last_name,
        $gender,
        $date_of_birth,
        $phone,
        $email,
        $blood_group,
        $emergency_contact,
        $address,
        $id
    ]);

    echo json_encode([
        "success" => true,
        "message" => "Patient updated successfully",
        "id" => $id
    ]);

} catch (PDOException $e) {

    echo json_encode([
        "success" => false,
        "message" => "Failed to update patient",
        "error" => $e->getMessage()
    ]);

} catch (Exception $e) {

    echo json_encode([
        "success" => false,
        "message" => "Server error",
        "error" => $e->getMessage()
    ]);
}

exit;
?>