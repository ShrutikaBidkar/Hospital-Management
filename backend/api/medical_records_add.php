<?php

header("Content-Type: application/json");

require_once "../config/database.php";

try {

    $data =
        json_decode(
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
        empty($data["record_date"])
    ) {

        echo json_encode([
            "success" => false,
            "message" => "Patient and record date are required"
        ]);

        exit;

    }


    $patient_id =
        intval($data["patient_id"]);


    $doctor_id =
        !empty($data["doctor_id"])
        ? intval($data["doctor_id"])
        : null;


    $diagnosis =
        trim($data["diagnosis"] ?? "");


    $symptoms =
        trim($data["symptoms"] ?? "");


    $treatment =
        trim($data["treatment"] ?? "");


    $notes =
        trim($data["notes"] ?? "");


    $record_date =
        $data["record_date"];


    /* CHECK PATIENT */

    $checkPatient =
        $pdo->prepare(
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


    /* CHECK DOCTOR */

    if ($doctor_id !== null) {

        $checkDoctor =
            $pdo->prepare(
                "SELECT id FROM doctors WHERE id = ?"
            );

        $checkDoctor->execute([
            $doctor_id
        ]);


        if (!$checkDoctor->fetch()) {

            echo json_encode([
                "success" => false,
                "message" => "Doctor not found"
            ]);

            exit;

        }

    }


    /* INSERT */

    $sql = "
        INSERT INTO medical_records
        (
            patient_id,
            doctor_id,
            diagnosis,
            symptoms,
            treatment,
            notes,
            record_date
        )
        VALUES
        (?, ?, ?, ?, ?, ?, ?)
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
        $record_date

    ]);


    echo json_encode([

        "success" => true,

        "message" => "Medical record added successfully",

        "record_id" =>
            $pdo->lastInsertId()

    ]);

} catch (PDOException $e) {

    echo json_encode([

        "success" => false,

        "message" => "Failed to add medical record",

        "error" => $e->getMessage()

    ]);

}

?>