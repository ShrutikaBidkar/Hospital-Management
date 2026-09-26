<?php

header("Content-Type: application/json; charset=UTF-8");


// ==========================================
// DATABASE CONNECTION
// ==========================================

$rootConfig =
    dirname(__DIR__, 2) .
    DIRECTORY_SEPARATOR .
    "config" .
    DIRECTORY_SEPARATOR .
    "database.php";

$backendConfig =
    dirname(__DIR__) .
    DIRECTORY_SEPARATOR .
    "config" .
    DIRECTORY_SEPARATOR .
    "database.php";


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


// ==========================================
// UPDATE MEDICAL RECORD
// ==========================================

try {

    $input =
        file_get_contents("php://input");

    $data =
        json_decode($input, true);


    if (!is_array($data)) {

        echo json_encode([
            "success" => false,
            "message" => "Invalid JSON data"
        ]);

        exit;
    }


    // ======================================
    // REQUIRED ID
    // ======================================

    if (
        !isset($data["id"]) ||
        empty($data["id"])
    ) {

        echo json_encode([
            "success" => false,
            "message" => "Medical record ID is required"
        ]);

        exit;
    }


    $id =
        intval($data["id"]);


    // ======================================
    // GET DATA
    // ======================================

    $patient_id =
        isset($data["patient_id"])
            ? intval($data["patient_id"])
            : 0;


    $doctor_id =
        isset($data["doctor_id"]) &&
        $data["doctor_id"] !== ""
            ? intval($data["doctor_id"])
            : null;


    $diagnosis =
        isset($data["diagnosis"])
            ? trim($data["diagnosis"])
            : "";


    $symptoms =
        isset($data["symptoms"])
            ? trim($data["symptoms"])
            : "";


    $treatment =
        isset($data["treatment"])
            ? trim($data["treatment"])
            : "";


    $notes =
        isset($data["notes"])
            ? trim($data["notes"])
            : "";


    $record_date =
        isset($data["record_date"])
            ? trim($data["record_date"])
            : "";


    // ======================================
    // VALIDATION
    // ======================================

    if ($patient_id <= 0) {

        echo json_encode([
            "success" => false,
            "message" => "Please select a patient"
        ]);

        exit;
    }


    if ($diagnosis === "") {

        echo json_encode([
            "success" => false,
            "message" => "Diagnosis is required"
        ]);

        exit;
    }


    if ($record_date === "") {

        echo json_encode([
            "success" => false,
            "message" => "Record date is required"
        ]);

        exit;
    }


    // ======================================
    // CHECK RECORD EXISTS
    // ======================================

    $check =
        $pdo->prepare(
            "SELECT id
             FROM medical_records
             WHERE id = ?"
        );

    $check->execute([$id]);


    if (!$check->fetch(PDO::FETCH_ASSOC)) {

        echo json_encode([
            "success" => false,
            "message" => "Medical record not found"
        ]);

        exit;
    }


    // ======================================
    // UPDATE RECORD
    // ======================================

    $sql = "
        UPDATE medical_records
        SET
            patient_id = ?,
            doctor_id = ?,
            diagnosis = ?,
            symptoms = ?,
            treatment = ?,
            notes = ?,
            record_date = ?
        WHERE id = ?
    ";


    $stmt =
        $pdo->prepare($sql);


    $stmt->execute([
        $patient_id,
        $doctor_id,
        $diagnosis,
        $symptoms,
        $treatment,
        $notes,
        $record_date,
        $id
    ]);


    // ======================================
    // SUCCESS
    // ======================================

    echo json_encode([
        "success" => true,
        "message" => "Medical record updated successfully",
        "id" => $id
    ]);

    exit;


} catch (PDOException $e) {

    echo json_encode([
        "success" => false,
        "message" => "Database error",
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