<?php

ini_set('display_errors', 0);
error_reporting(E_ALL);

header("Content-Type: application/json");

try {

    // ==========================================
    // DATABASE CONNECTION
    // ==========================================

    require_once "../config/database.php";
    // ==========================================
    // GET JSON DATA
    // ==========================================

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


    // ==========================================
    // REQUIRED FIELDS
    // ==========================================

    if (
        empty($data["id"]) ||
        empty($data["doctor_code"]) ||
        empty($data["first_name"])
    ) {

        echo json_encode([
            "success" => false,
            "message" =>
                "ID, doctor code and first name are required"
        ]);

        exit;
    }


    // ==========================================
    // GET DATA
    // ==========================================

    $id = intval($data["id"]);

    $doctor_code =
        trim($data["doctor_code"]);

    $first_name =
        trim($data["first_name"]);

    $last_name =
        trim($data["last_name"] ?? "");

    $specialization =
        trim($data["specialization"] ?? "");

    $phone =
        trim($data["phone"] ?? "");

    $email =
        trim($data["email"] ?? "");

    $department_id =
        !empty($data["department_id"])
            ? intval($data["department_id"])
            : null;


    // ==========================================
    // CHECK DOCTOR EXISTS
    // ==========================================

    $checkDoctor = $pdo->prepare("
        SELECT id
        FROM doctors
        WHERE id = ?
    ");

    $checkDoctor->execute([$id]);

    $doctor = $checkDoctor->fetch();


    if (!$doctor) {

        echo json_encode([
            "success" => false,
            "message" => "Doctor not found"
        ]);

        exit;
    }


    // ==========================================
    // UPDATE DOCTOR
    // ==========================================

    $sql = "
        UPDATE doctors
        SET
            doctor_code = ?,
            first_name = ?,
            last_name = ?,
            specialization = ?,
            phone = ?,
            email = ?,
            department_id = ?
        WHERE id = ?
    ";


    $stmt = $pdo->prepare($sql);


    $stmt->execute([

        $doctor_code,
        $first_name,
        $last_name,
        $specialization,
        $phone,
        $email,
        $department_id,
        $id

    ]);


    // ==========================================
    // SUCCESS
    // ==========================================

    echo json_encode([
        "success" => true,
        "message" => "Doctor updated successfully"
    ]);

    exit;


} catch (Throwable $e) {

    // ==========================================
    // RETURN PHP ERROR AS JSON
    // ==========================================

    echo json_encode([
        "success" => false,
        "message" => "PHP Error",
        "error" => $e->getMessage(),
        "line" => $e->getLine(),
        "file" => basename($e->getFile())
    ]);

    exit;
}

?>