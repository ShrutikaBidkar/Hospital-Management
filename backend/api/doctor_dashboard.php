<?php

session_start();

header("Content-Type: application/json");

require_once "../config/database.php";

try {

    /* =========================
       CHECK LOGIN
    ========================= */

    if (!isset($_SESSION["user"])) {

        echo json_encode([
            "success" => false,
            "message" => "Not logged in"
        ]);

        exit;
    }


    /* =========================
       CHECK ROLE
    ========================= */

    if (
        !isset($_SESSION["user"]["role"]) ||
        $_SESSION["user"]["role"] !== "doctor"
    ) {

        echo json_encode([
            "success" => false,
            "message" => "Access denied"
        ]);

        exit;
    }


    /* =========================
       GET DOCTOR USERNAME
    ========================= */

    $username = $_SESSION["user"]["username"];


    /* =========================
       GET DOCTOR ID FROM DATABASE
    ========================= */

    $stmt = $pdo->prepare("
        SELECT id, doctor_code, first_name, last_name, username
        FROM doctors
        WHERE username = ?
        LIMIT 1
    ");

    $stmt->execute([$username]);

    $doctor = $stmt->fetch(PDO::FETCH_ASSOC);


    if (!$doctor) {

        echo json_encode([
            "success" => false,
            "message" => "Doctor not found"
        ]);

        exit;
    }


    $doctorId = $doctor["id"];


    /* =========================
       TOTAL PATIENTS
    ========================= */

    $stmt = $pdo->prepare("
        SELECT COUNT(DISTINCT patient_id)
        FROM appointments
        WHERE doctor_id = ?
    ");

    $stmt->execute([$doctorId]);

    $totalPatients = (int)$stmt->fetchColumn();


    /* =========================
       TOTAL APPOINTMENTS
    ========================= */

    $stmt = $pdo->prepare("
        SELECT COUNT(*)
        FROM appointments
        WHERE doctor_id = ?
    ");

    $stmt->execute([$doctorId]);

    $totalAppointments = (int)$stmt->fetchColumn();


    /* =========================
       TOTAL MEDICAL RECORDS
    ========================= */

    $stmt = $pdo->prepare("
        SELECT COUNT(*)
        FROM medical_records
        WHERE doctor_id = ?
    ");

    $stmt->execute([$doctorId]);

    $totalRecords = (int)$stmt->fetchColumn();


    /* =========================
       TOTAL PRESCRIPTIONS
    ========================= */

    $stmt = $pdo->prepare("
        SELECT COUNT(*)
        FROM prescriptions
        WHERE doctor_id = ?
    ");

    $stmt->execute([$doctorId]);

    $totalPrescriptions = (int)$stmt->fetchColumn();


    /* =========================
       TODAY'S APPOINTMENTS
    ========================= */

    $stmt = $pdo->prepare("
        SELECT
            a.id,
            a.patient_id,
            a.doctor_id,
            a.appointment_date,
            a.appointment_time,
            a.reason,
            a.status,

            CONCAT(
                COALESCE(p.first_name, ''),
                ' ',
                COALESCE(p.last_name, '')
            ) AS patient_name

        FROM appointments a

        LEFT JOIN patients p
            ON a.patient_id = p.id

        WHERE a.doctor_id = ?

        AND DATE(a.appointment_date) = CURDATE()

        ORDER BY a.appointment_time ASC
    ");

    $stmt->execute([$doctorId]);

    $todayAppointments = $stmt->fetchAll(PDO::FETCH_ASSOC);


    /* =========================
       FINAL RESPONSE
    ========================= */

    echo json_encode([

        "success" => true,

        "doctor_id" => $doctorId,

        "doctor_name" =>
            $doctor["first_name"] . " " . $doctor["last_name"],

        "total_patients" => $totalPatients,

        "total_appointments" => $totalAppointments,

        "total_records" => $totalRecords,

        "total_prescriptions" => $totalPrescriptions,

        "today_appointments" => $todayAppointments

    ]);

} catch (PDOException $e) {

    echo json_encode([

        "success" => false,

        "message" => "Database error: " . $e->getMessage()

    ]);

}

?>