<?php

header("Content-Type: application/json");

require_once "../config/database.php";

try {

    $sql = "
        SELECT
            medical_records.id,
            medical_records.patient_id,
            medical_records.doctor_id,
            medical_records.diagnosis,
            medical_records.symptoms,
            medical_records.treatment,
            medical_records.notes,
            medical_records.record_date,

            CONCAT(
                patients.first_name,
                ' ',
                COALESCE(patients.last_name, '')
            ) AS patient_name,

            CASE
                WHEN doctors.id IS NOT NULL
                THEN CONCAT(
                    'Dr. ',
                    doctors.first_name,
                    ' ',
                    COALESCE(doctors.last_name, '')
                )
                ELSE NULL
            END AS doctor_name

        FROM medical_records

        INNER JOIN patients
            ON medical_records.patient_id = patients.id

        LEFT JOIN doctors
            ON medical_records.doctor_id = doctors.id

        ORDER BY medical_records.id ASC
    ";


    $stmt = $pdo->prepare($sql);

    $stmt->execute();

    $records = $stmt->fetchAll();


    echo json_encode([

        "success" => true,

        "data" => $records

    ]);

} catch (PDOException $e) {

    echo json_encode([

        "success" => false,

        "message" => "Failed to load medical records",

        "error" => $e->getMessage()

    ]);

}

?>