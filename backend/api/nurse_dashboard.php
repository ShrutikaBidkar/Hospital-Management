 <?php

session_start();

header("Content-Type: application/json");

require_once "../config/database.php";

try {

    // Login check
    if (!isset($_SESSION["user"])) {
        echo json_encode([
            "success" => false,
            "message" => "Not logged in"
        ]);
        exit;
    }

    // Allow Admin and Nurse
    $role = $_SESSION["user"]["role"] ?? "";

    if ($role !== "admin" && $role !== "nurse") {
        echo json_encode([
            "success" => false,
            "message" => "Access denied"
        ]);
        exit;
    }


    /* =========================
       DASHBOARD COUNTS
    ========================= */

    // Total Patients
    $stmt = $pdo->query("SELECT COUNT(*) FROM patients");
    $totalPatients = (int)$stmt->fetchColumn();


    // Total Admissions
    $stmt = $pdo->query("SELECT COUNT(*) FROM admissions");
    $totalAdmissions = (int)$stmt->fetchColumn();


    // Total Medical Records
    $stmt = $pdo->query("SELECT COUNT(*) FROM medical_records");
    $totalRecords = (int)$stmt->fetchColumn();


    /* =========================
       TODAY'S APPOINTMENTS
    ========================= */

    $sql = "
        SELECT
            a.id,
            a.appointment_date,
            a.appointment_time,
            a.reason,
            a.status,

            CONCAT(
                p.first_name,
                ' ',
                p.last_name
            ) AS patient_name,

            CONCAT(
                d.first_name,
                ' ',
                d.last_name
            ) AS doctor_name

        FROM appointments a

        LEFT JOIN patients p
            ON a.patient_id = p.id

        LEFT JOIN doctors d
            ON a.doctor_id = d.id

        WHERE a.appointment_date = CURDATE()

        ORDER BY a.appointment_time ASC
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute();

    $todayAppointments = $stmt->fetchAll();


    /* =========================
       FINAL RESPONSE
    ========================= */

    echo json_encode([
        "success" => true,

        "total_patients" => $totalPatients,

        "total_admissions" => $totalAdmissions,

        "total_records" => $totalRecords,

        "today_appointments" => $todayAppointments
    ]);

} catch (PDOException $e) {

    echo json_encode([
        "success" => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
}

?>