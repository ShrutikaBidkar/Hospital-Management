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
        empty($data["admission_date"])
    ) {

        echo json_encode([
            "success" => false,
            "message" => "Patient and admission date are required"
        ]);

        exit;
    }


    $patient_id =
        intval($data["patient_id"]);

    $admission_date =
        trim($data["admission_date"]);

    $room_number =
        trim($data["room_number"] ?? "");

    $bed_number =
        trim($data["bed_number"] ?? "");

    $diagnosis =
        trim($data["diagnosis"] ?? "");

    $status =
        trim($data["status"] ?? "Admitted");


    // Check patient

    $checkPatient = $pdo->prepare(
        "SELECT id FROM patients WHERE id = ?"
    );

    $checkPatient->execute([
        $patient_id
    ]);


    if (!$checkPatient->fetch()) {

        echo json_encode([
            "success" => false,
            "message" => "Patient not found"
        ]);

        exit;
    }


    // Insert admission

    $sql = "INSERT INTO admissions
            (
                patient_id,
                admission_date,
                room_number,
                bed_number,
                diagnosis,
                status
            )
            VALUES (?, ?, ?, ?, ?, ?)";


    $stmt = $pdo->prepare($sql);


    $stmt->execute([
        $patient_id,
        $admission_date,
        $room_number,
        $bed_number,
        $diagnosis,
        $status
    ]);


    echo json_encode([
        "success" => true,
        "message" => "Patient admitted successfully",
        "admission_id" => $pdo->lastInsertId()
    ]);

} catch (PDOException $e) {

    echo json_encode([
        "success" => false,
        "message" => "Failed to add admission",
        "error" => $e->getMessage()
    ]);

}

?>