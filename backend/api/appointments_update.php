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


    // Required fields

    if (
        empty($data["id"]) ||
        empty($data["patient_id"]) ||
        empty($data["doctor_id"]) ||
        empty($data["appointment_date"]) ||
        empty($data["appointment_time"])
    ) {

        echo json_encode([
            "success" => false,
            "message" => "Appointment ID, patient, doctor, date and time are required"
        ]);

        exit;
    }


    $id = intval($data["id"]);

    $patient_id =
        intval($data["patient_id"]);

    $doctor_id =
        intval($data["doctor_id"]);

    $appointment_date =
        trim($data["appointment_date"]);

    $appointment_time =
        trim($data["appointment_time"]);

    $reason =
        trim($data["reason"] ?? "");

    $status =
        trim($data["status"] ?? "Scheduled");


    // Check appointment

    $checkAppointment = $pdo->prepare(
        "SELECT id FROM appointments WHERE id = ?"
    );

    $checkAppointment->execute([
        $id
    ]);

    if (!$checkAppointment->fetch()) {

        echo json_encode([
            "success" => false,
            "message" => "Appointment not found"
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


    // Check doctor

    $checkDoctor = $pdo->prepare(
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


    // Update appointment

    $sql = "UPDATE appointments SET

                patient_id = ?,
                doctor_id = ?,
                appointment_date = ?,
                appointment_time = ?,
                reason = ?,
                status = ?

            WHERE id = ?";


    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        $patient_id,
        $doctor_id,
        $appointment_date,
        $appointment_time,
        $reason,
        $status,
        $id
    ]);


    echo json_encode([
        "success" => true,
        "message" => "Appointment updated successfully"
    ]);

} catch (PDOException $e) {

    echo json_encode([
        "success" => false,
        "message" => "Failed to update appointment",
        "error" => $e->getMessage()
    ]);

}

?>