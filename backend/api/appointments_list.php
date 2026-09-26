<?php

header("Content-Type: application/json");

require_once "../config/database.php";

try {

    $sql = "SELECT
                appointments.id,
                appointments.patient_id,
                appointments.doctor_id,
                appointments.appointment_date,
                appointments.appointment_time,
                appointments.reason,
                appointments.status,

                CONCAT(
                    patients.first_name,
                    ' ',
                    COALESCE(patients.last_name, '')
                ) AS patient_name,

                CONCAT(
                    doctors.first_name,
                    ' ',
                    COALESCE(doctors.last_name, '')
                ) AS doctor_name

            FROM appointments

            INNER JOIN patients
                ON appointments.patient_id = patients.id

            INNER JOIN doctors
                ON appointments.doctor_id = doctors.id

            ORDER BY appointments.id ASC";

    $stmt = $pdo->prepare($sql);

    $stmt->execute();

    $appointments = $stmt->fetchAll();

    echo json_encode([
        "success" => true,
        "data" => $appointments
    ]);

} catch (PDOException $e) {

    echo json_encode([
        "success" => false,
        "message" => "Failed to fetch appointments",
        "error" => $e->getMessage()
    ]);

}

?>