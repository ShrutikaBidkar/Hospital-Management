<?php

header("Content-Type: application/json");

require_once "../config/database.php";

try {

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


    if (
        empty($data["patient_id"]) ||
        empty($data["invoice_number"]) ||
        empty($data["billing_date"])
    ) {

        echo json_encode([
            "success" => false,
            "message" => "Patient, invoice number and billing date are required"
        ]);

        exit;
    }


    $patient_id = intval($data["patient_id"]);

    $invoice_number =
        trim($data["invoice_number"]);

    $consultation_fee =
        floatval($data["consultation_fee"] ?? 0);

    $medicine_fee =
        floatval($data["medicine_fee"] ?? 0);

    $room_fee =
        floatval($data["room_fee"] ?? 0);

    $other_fee =
        floatval($data["other_fee"] ?? 0);

    $payment_status =
        trim($data["payment_status"] ?? "Pending");

    $payment_method =
        trim($data["payment_method"] ?? "");

    $billing_date =
        $data["billing_date"];


    /* Calculate Total */

    $total_amount =
        $consultation_fee +
        $medicine_fee +
        $room_fee +
        $other_fee;


    /* Check Negative Values */

    if (
        $consultation_fee < 0 ||
        $medicine_fee < 0 ||
        $room_fee < 0 ||
        $other_fee < 0
    ) {

        echo json_encode([
            "success" => false,
            "message" => "Fees cannot be negative"
        ]);

        exit;
    }


    /* Check Patient */

    $stmt = $pdo->prepare(
        "SELECT id FROM patients WHERE id = ?"
    );

    $stmt->execute([$patient_id]);

    if (!$stmt->fetch()) {

        echo json_encode([
            "success" => false,
            "message" => "Patient not found"
        ]);

        exit;
    }


    /* Check Invoice Number */

    $stmt = $pdo->prepare(
        "SELECT id FROM billing WHERE invoice_number = ?"
    );

    $stmt->execute([$invoice_number]);

    if ($stmt->fetch()) {

        echo json_encode([
            "success" => false,
            "message" => "Invoice number already exists"
        ]);

        exit;
    }


    /* Insert Bill */

    $sql = "
        INSERT INTO billing
        (
            patient_id,
            invoice_number,
            consultation_fee,
            medicine_fee,
            room_fee,
            other_fee,
            total_amount,
            payment_status,
            payment_method,
            billing_date
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ";


    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        $patient_id,
        $invoice_number,
        $consultation_fee,
        $medicine_fee,
        $room_fee,
        $other_fee,
        $total_amount,
        $payment_status,
        $payment_method,
        $billing_date
    ]);


    echo json_encode([
        "success" => true,
        "message" => "Bill created successfully",
        "bill_id" => $pdo->lastInsertId()
    ]);


} catch (PDOException $e) {

    echo json_encode([
        "success" => false,
        "message" => "Failed to create bill",
        "error" => $e->getMessage()
    ]);

}

?>