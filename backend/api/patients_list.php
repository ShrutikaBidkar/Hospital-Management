<?php

header("Content-Type: application/json");

require_once "../config/database.php";

try {

    $sql = "SELECT
                id,
                patient_code,
                first_name,
                last_name,
                gender,
                date_of_birth,
                phone,
                email,
                address,
                blood_group,
                emergency_contact,
                created_at
            FROM patients
            ORDER BY id ASC";

    $stmt = $pdo->prepare($sql);

    $stmt->execute();

    $patients = $stmt->fetchAll();

    echo json_encode([
        "success" => true,
        "data" => $patients
    ]);

} catch (PDOException $e) {

    echo json_encode([
        "success" => false,
        "message" => "Failed to fetch patients",
        "error" => $e->getMessage()
    ]);

}

?>