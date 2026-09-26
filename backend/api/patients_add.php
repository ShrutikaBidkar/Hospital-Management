<?php

header("Content-Type: application/json");

require_once "../config/database.php";

try {

    $data = json_decode(file_get_contents("php://input"), true);

    if (!$data) {
        echo json_encode([
            "success" => false,
            "message" => "Invalid JSON data"
        ]);
        exit;
    }

    // Required fields
    if (
        empty($data["first_name"]) ||
        empty($data["patient_code"])
    ) {
        echo json_encode([
            "success" => false,
            "message" => "Patient code and first name are required"
        ]);
        exit;
    }

    $patient_code = trim($data["patient_code"]);
    $first_name = trim($data["first_name"]);
    $last_name = trim($data["last_name"] ?? "");
    $gender = trim($data["gender"] ?? "");
    $date_of_birth = !empty($data["date_of_birth"])
        ? $data["date_of_birth"]
        : null;
    $phone = trim($data["phone"] ?? "");
    $email = trim($data["email"] ?? "");
    $address = trim($data["address"] ?? "");
    $blood_group = trim($data["blood_group"] ?? "");
    $emergency_contact = trim($data["emergency_contact"] ?? "");


    // Check duplicate patient code
    $check = $pdo->prepare(
        "SELECT id FROM patients WHERE patient_code = ?"
    );

    $check->execute([$patient_code]);

    if ($check->fetch()) {

        echo json_encode([
            "success" => false,
            "message" => "Patient code already exists"
        ]);

        exit;
    }


    // Insert patient
    $sql = "INSERT INTO patients
            (
                patient_code,
                first_name,
                last_name,
                gender,
                date_of_birth,
                phone,
                email,
                address,
                blood_group,
                emergency_contact
            )
            VALUES
            (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";


    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        $patient_code,
        $first_name,
        $last_name,
        $gender,
        $date_of_birth,
        $phone,
        $email,
        $address,
        $blood_group,
        $emergency_contact
    ]);


    echo json_encode([
        "success" => true,
        "message" => "Patient added successfully",
        "patient_id" => $pdo->lastInsertId()
    ]);

} catch (PDOException $e) {

    echo json_encode([
        "success" => false,
        "message" => "Failed to add patient",
        "error" => $e->getMessage()
    ]);

}

?>