<?php

header("Content-Type: application/json");

require_once "../config/database.php";

try {

    $sql = "SELECT
                admissions.id,
                admissions.patient_id,
                admissions.admission_date,
                admissions.discharge_date,
                admissions.room_number,
                admissions.bed_number,
                admissions.diagnosis,
                admissions.status,

                CONCAT(
                    patients.first_name,
                    ' ',
                    COALESCE(patients.last_name, '')
                ) AS patient_name

            FROM admissions

            INNER JOIN patients
                ON admissions.patient_id = patients.id

            ORDER BY admissions.id ASC";


    $stmt = $pdo->prepare($sql);

    $stmt->execute();

    $admissions = $stmt->fetchAll();


    echo json_encode([
        "success" => true,
        "data" => $admissions
    ]);

} catch (PDOException $e) {

    echo json_encode([
        "success" => false,
        "message" => "Failed to fetch admissions",
        "error" => $e->getMessage()
    ]);

}

?>