<?php

header("Content-Type: application/json");

require_once "../config/database.php";

try {

    /* Total Patients */

    $patients = $pdo->query(
        "SELECT COUNT(*) FROM patients"
    )->fetchColumn();


    /* Total Doctors */

    $doctors = $pdo->query(
        "SELECT COUNT(*) FROM doctors"
    )->fetchColumn();


    /* Total Departments */

    $departments = $pdo->query(
        "SELECT COUNT(*) FROM departments"
    )->fetchColumn();


    /* Total Appointments */

    $appointments = $pdo->query(
        "SELECT COUNT(*) FROM appointments"
    )->fetchColumn();


    /* Active Admissions */

    $admissions = $pdo->query(
        "SELECT COUNT(*)
         FROM admissions
         WHERE status = 'Admitted'"
    )->fetchColumn();


    /* Total Medical Records */

    $medical_records = $pdo->query(
        "SELECT COUNT(*) FROM medical_records"
    )->fetchColumn();


    /* Total Prescriptions */

    $prescriptions = $pdo->query(
        "SELECT COUNT(*) FROM prescriptions"
    )->fetchColumn();


    /* Total Medicines */

    $medicines = $pdo->query(
        "SELECT COUNT(*) FROM medicines"
    )->fetchColumn();


    /* Total Bills */

    $bills = $pdo->query(
        "SELECT COUNT(*) FROM billing"
    )->fetchColumn();


    /* Total Revenue */

    $revenue = $pdo->query(
        "SELECT COALESCE(SUM(total_amount), 0)
         FROM billing"
    )->fetchColumn();


    /* Paid Amount */

    $paid = $pdo->query(
        "SELECT COALESCE(SUM(total_amount), 0)
         FROM billing
         WHERE payment_status = 'Paid'"
    )->fetchColumn();


    /* Pending Amount */

    $pending = $pdo->query(
        "SELECT COALESCE(SUM(total_amount), 0)
         FROM billing
         WHERE payment_status = 'Pending'"
    )->fetchColumn();


    /* Response */

    echo json_encode([

        "success" => true,

        "data" => [

            "patients" => (int)$patients,

            "doctors" => (int)$doctors,

            "departments" => (int)$departments,

            "appointments" => (int)$appointments,

            "admissions" => (int)$admissions,

            "medical_records" => (int)$medical_records,

            "prescriptions" => (int)$prescriptions,

            "medicines" => (int)$medicines,

            "bills" => (int)$bills,

            "revenue" => (float)$revenue,

            "paid" => (float)$paid,

            "pending" => (float)$pending

        ]

    ]);

} catch (PDOException $e) {

    echo json_encode([

        "success" => false,

        "message" => "Failed to generate reports",

        "error" => $e->getMessage()

    ]);

}

?>