<?php

header("Content-Type: application/json");

require_once "../config/database.php";

try {

    $sql = "
        SELECT
            billing.id,
            billing.patient_id,

            CONCAT(
                patients.first_name,
                ' ',
                COALESCE(patients.last_name, '')
            ) AS patient_name,

            billing.invoice_number,
            billing.consultation_fee,
            billing.medicine_fee,
            billing.room_fee,
            billing.other_fee,
            billing.total_amount,
            billing.payment_status,
            billing.payment_method,
            billing.billing_date

        FROM billing

        INNER JOIN patients
            ON billing.patient_id = patients.id

        ORDER BY billing.id ASC
    ";

    $stmt = $pdo->query($sql);

    $bills = $stmt->fetchAll();

    echo json_encode([
        "success" => true,
        "data" => $bills
    ]);

} catch (PDOException $e) {

    echo json_encode([
        "success" => false,
        "message" => "Failed to load bills",
        "error" => $e->getMessage()
    ]);

}

?>