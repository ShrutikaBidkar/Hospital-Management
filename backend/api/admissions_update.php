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
        empty($data["id"]) ||
        empty($data["patient_id"]) ||
        empty($data["admission_date"])
    ) {

        echo json_encode([
            "success" => false,
            "message" => "Admission ID, patient and admission date are required"
        ]);

        exit;
    }


    $id =
        intval($data["id"]);

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


    // Check admission

    $checkAdmission = $pdo->prepare(
        "SELECT id FROM admissions WHERE id = ?"
    );

    $checkAdmission->execute([
        $id
    ]);


    if (!$checkAdmission->fetch()) {

        echo json_encode([
            "success" => false,
            "message" => "Admission not found"
        ]);

        exit;
    }


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


    // Update admission

    $sql = "UPDATE admissions SET

                patient_id = ?,
                admission_date = ?,
                room_number = ?,
                bed_number = ?,
                diagnosis = ?,
                status = ?

            WHERE id = ?";


    $stmt = $pdo->prepare($sql);


    $stmt->execute([
        $patient_id,
        $admission_date,
        $room_number,
        $bed_number,
        $diagnosis,
        $status,
        $id
    ]);


    echo json_encode([
        "success" => true,
        "message" => "Admission updated successfully"
    ]);

} catch (PDOException $e) {

    echo json_encode([
        "success" => false,
        "message" => "Failed to update admission",
        "error" => $e->getMessage()
    ]);

}

?>