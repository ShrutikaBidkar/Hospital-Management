<?php

header("Content-Type: application/json");

session_start();

require_once "../config/database.php";

try {

    // Check receptionist login
    if (
        !isset($_SESSION["user"]) ||
        $_SESSION["user"]["role"] !== "receptionist"
    ) {
        echo json_encode([
            "success" => false,
            "message" => "Receptionist not logged in"
        ]);
        exit;
    }


    // Receptionist name
    $receptionistName =
        $_SESSION["user"]["name"]
        ?? $_SESSION["user"]["username"]
        ?? "Receptionist";


    // ==========================================
    // 1. TOTAL PATIENTS
    // ==========================================

    $stmt = $pdo->query(
        "SELECT COUNT(*) FROM patients"
    );

    $totalPatients = (int)$stmt->fetchColumn();


    // ==========================================
    // 2. TODAY'S APPOINTMENTS
    // ==========================================

    $stmt = $pdo->query(
        "SELECT COUNT(*)
         FROM appointments
         WHERE DATE(appointment_date) = CURDATE()"
    );

    $todayAppointments = (int)$stmt->fetchColumn();


    // ==========================================
    // 3. CURRENT ADMISSIONS
    // ==========================================

    $stmt = $pdo->query(
        "SELECT COUNT(*) FROM admissions"
    );

    $currentAdmissions = (int)$stmt->fetchColumn();


    // ==========================================
    // 4. PENDING BILLS
    // ==========================================

    $stmt = $pdo->query(
        "SELECT COUNT(*) FROM billing"
    );

    $pendingBills = (int)$stmt->fetchColumn();


    // ==========================================
    // TODAY'S APPOINTMENT LIST
    // ==========================================

    $sql = "
        SELECT
            a.id,
            a.appointment_date,
            a.appointment_time,
            a.reason,

            CONCAT(
                COALESCE(p.first_name, ''),
                ' ',
                COALESCE(p.last_name, '')
            ) AS patient_name,

            CONCAT(
                COALESCE(d.first_name, ''),
                ' ',
                COALESCE(d.last_name, '')
            ) AS doctor_name

        FROM appointments a

        LEFT JOIN patients p
            ON a.patient_id = p.id

        LEFT JOIN doctors d
            ON a.doctor_id = d.id

        WHERE DATE(a.appointment_date) = CURDATE()

        ORDER BY a.appointment_time ASC
    ";


    $stmt = $pdo->prepare($sql);
    $stmt->execute();

    $appointments = $stmt->fetchAll(PDO::FETCH_ASSOC);


    // ==========================================
    // ADD DEFAULT STATUS FOR DISPLAY
    // ==========================================

    foreach ($appointments as &$appointment) {
        $appointment["status"] = "Scheduled";
    }

    unset($appointment);


    // ==========================================
    // FINAL RESPONSE
    // ==========================================

    echo json_encode([
        "success" => true,

        "receptionist" => $receptionistName,

        "total_patients" => $totalPatients,

        "today_appointments" => $todayAppointments,

        "current_admissions" => $currentAdmissions,

        "pending_bills" => $pendingBills,

        "appointments" => $appointments
    ]);

} catch (PDOException $e) {

    echo json_encode([
        "success" => false,
        "message" => "Database error",
        "error" => $e->getMessage()
    ]);
}

?>

