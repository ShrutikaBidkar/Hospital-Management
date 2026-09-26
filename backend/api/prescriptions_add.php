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


    if (
        empty($data["patient_id"]) ||
        empty($data["doctor_id"]) ||
        empty($data["medicine_id"]) ||
        empty($data["dosage"]) ||
        empty($data["frequency"]) ||
        empty($data["duration"]) ||
        empty($data["prescription_date"])
    ) {

        echo json_encode([
            "success" => false,
            "message" => "Please fill all required fields"
        ]);

        exit;
    }


    $patient_id = intval($data["patient_id"]);
    $doctor_id = intval($data["doctor_id"]);
    $medicine_id = intval($data["medicine_id"]);

    $dosage = trim($data["dosage"]);
    $frequency = trim($data["frequency"]);
    $duration = trim($data["duration"]);
    $instructions = trim($data["instructions"] ?? "");
    $prescription_date = $data["prescription_date"];


    /* Check Patient */

    $stmt = $pdo->prepare(
        "SELECT id FROM patients WHERE id = ?"
    );

    $stmt->execute([$patient_id]);

    if (!$stmt->fetch()) {

        echo json_encode([
            "success" => false,
            "message" => "Patient not found"
        ]);

        exit;
    }


    /* Check Doctor */

    $stmt = $pdo->prepare(
        "SELECT id FROM doctors WHERE id = ?"
    );

    $stmt->execute([$doctor_id]);

    if (!$stmt->fetch()) {

        echo json_encode([
            "success" => false,
            "message" => "Doctor not found"
        ]);

        exit;
    }


    /* Check Medicine */

    $stmt = $pdo->prepare(
        "SELECT id FROM medicines WHERE id = ?"
    );

    $stmt->execute([$medicine_id]);

    if (!$stmt->fetch()) {

        echo json_encode([
            "success" => false,
            "message" => "Medicine not found"
        ]);

        exit;
    }


    /* Insert Prescription */

    $sql = "
        INSERT INTO prescriptions
        (
            patient_id,
            doctor_id,
            medicine_id,
            dosage,
            frequency,
            duration,
            instructions,
            prescription_date
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ";

    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        $patient_id,
        $doctor_id,
        $medicine_id,
        $dosage,
        $frequency,
        $duration,
        $instructions,
        $prescription_date
    ]);


    echo json_encode([
        "success" => true,
        "message" => "Prescription added successfully",
        "prescription_id" => $pdo->lastInsertId()
    ]);


} catch (PDOException $e) {

    echo json_encode([
        "success" => false,
        "message" => "Failed to add prescription",
        "error" => $e->getMessage()
    ]);

}

?>