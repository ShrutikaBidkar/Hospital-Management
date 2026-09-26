<?php

header("Content-Type: application/json");

require_once "../config/database.php";

try {

    $patients = $pdo->query(
        "SELECT COUNT(*) FROM patients"
    )->fetchColumn();


    $doctors = $pdo->query(
        "SELECT COUNT(*) FROM doctors"
    )->fetchColumn();


    $appointments = $pdo->query(
        "SELECT COUNT(*) FROM appointments"
    )->fetchColumn();


    $admissions = $pdo->query(
        "SELECT COUNT(*) 
         FROM admissions 
         WHERE status = 'Admitted'"
    )->fetchColumn();


    echo json_encode([

        "success" => true,

        "data" => [

            "patients" => (int)$patients,

            "doctors" => (int)$doctors,

            "appointments" => (int)$appointments,

            "admissions" => (int)$admissions

        ]

    ]);

}

catch (PDOException $e) {

    echo json_encode([

        "success" => false,

        "message" => "Failed to load dashboard data",

        "error" => $e->getMessage()

    ]);

}

?>