<?php

header("Content-Type: application/json");

require_once "../config/database.php";

try {

    $sql = "
        SELECT
            prescriptions.id,
            prescriptions.patient_id,
            prescriptions.doctor_id,
            prescriptions.medicine_id,

            CONCAT(
                patients.first_name,
                ' ',
                COALESCE(patients.last_name, '')
            ) AS patient_name,

            CONCAT(
                doctors.first_name,
                ' ',
                COALESCE(doctors.last_name, '')
            ) AS doctor_name,

            medicines.medicine_name,

            prescriptions.dosage,
            prescriptions.frequency,
            prescriptions.duration,
            prescriptions.instructions,
            prescriptions.prescription_date

        FROM prescriptions

        INNER JOIN patients
            ON prescriptions.patient_id = patients.id

        INNER JOIN doctors
            ON prescriptions.doctor_id = doctors.id

        INNER JOIN medicines
            ON prescriptions.medicine_id = medicines.id

        ORDER BY prescriptions.id ASC
    ";

    $stmt = $pdo->query($sql);

    $prescriptions = $stmt->fetchAll();

    echo json_encode([
        "success" => true,
        "data" => $prescriptions
    ]);

} catch (PDOException $e) {

    echo json_encode([
        "success" => false,
        "message" => "Failed to load prescriptions",
        "error" => $e->getMessage()
    ]);

}

?>