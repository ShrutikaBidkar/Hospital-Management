<?php

header("Content-Type: application/json");

require_once "../config/database.php";

try {

    $sql = "SELECT
                doctors.id,
                doctors.doctor_code,
                doctors.first_name,
                doctors.last_name,
                doctors.specialization,
                doctors.phone,
                doctors.email,
                doctors.department_id,
                departments.department_name,
                doctors.created_at
            FROM doctors
            LEFT JOIN departments
            ON doctors.department_id = departments.id
            WHERE doctors.status = 'Active'
            ORDER BY doctors.id ASC";


    $stmt = $pdo->prepare($sql);

    $stmt->execute();

    $doctors = $stmt->fetchAll();

    echo json_encode([
        "success" => true,
        "data" => $doctors
    ]);

} catch (PDOException $e) {

    echo json_encode([
        "success" => false,
        "message" => "Failed to fetch doctors",
        "error" => $e->getMessage()
    ]);

}

?>