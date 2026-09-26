<?php

header("Content-Type: application/json");

require_once "../config/database.php";

try {

    // Receive JSON data
    $data = json_decode(file_get_contents("php://input"), true);

    if (!$data) {
        echo json_encode([
            "success" => false,
            "message" => "Invalid JSON data"
        ]);
        exit;
    }

    // Get values
    $patient_id = intval($data["patient_id"] ?? 0);
    $doctor_id = intval($data["doctor_id"] ?? 0);
    $appointment_date = trim($data["appointment_date"] ?? "");
    $appointment_time = trim($data["appointment_time"] ?? "");
    $reason = trim($data["reason"] ?? "");
    $status = trim($data["status"] ?? "Scheduled");


    // Validation
    if (
        $patient_id <= 0 ||
        $doctor_id <= 0 ||
        $appointment_date === "" ||
        $appointment_time === ""
    ) {

        echo json_encode([
            "success" => false,
            "message" => "Patient, doctor, date and time are required"
        ]);

        exit;
    }


    /*
       IMPORTANT:
       Same patient can have multiple appointments.

       We DO NOT check whether the patient
       already has an appointment.

       Therefore:
       Rahul → Appointment 1
       Rahul → Appointment 2
       Rahul → Appointment 3

       All are allowed.
    */


    // Check patient exists
    $patientCheck = $pdo->prepare(
        "SELECT id FROM patients WHERE id = ?"
    );

    $patientCheck->execute([$patient_id]);

    if (!$patientCheck->fetch()) {

        echo json_encode([
            "success" => false,
            "message" => "Selected patient does not exist"
        ]);

        exit;
    }


    // Check doctor exists
    $doctorCheck = $pdo->prepare(
        "SELECT id FROM doctors WHERE id = ?"
    );

    $doctorCheck->execute([$doctor_id]);

    if (!$doctorCheck->fetch()) {

        echo json_encode([
            "success" => false,
            "message" => "Selected doctor does not exist"
        ]);

        exit;
    }


    // Insert appointment
    $sql = "INSERT INTO appointments
            (
                patient_id,
                doctor_id,
                appointment_date,
                appointment_time,
                reason,
                status
            )
            VALUES (?, ?, ?, ?, ?, ?)";

    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        $patient_id,
        $doctor_id,
        $appointment_date,
        $appointment_time,
        $reason,
        $status
    ]);


    echo json_encode([
        "success" => true,
        "message" => "Appointment added successfully",
        "appointment_id" => $pdo->lastInsertId()
    ]);

} catch (PDOException $e) {

    echo json_encode([
        "success" => false,
        "message" => "Database error",
        "error" => $e->getMessage()
    ]);

} catch (Exception $e) {

    echo json_encode([
        "success" => false,
        "message" => "Server error",
        "error" => $e->getMessage()
    ]);
}

?>