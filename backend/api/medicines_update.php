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
        empty($data["id"]) ||
        empty($data["medicine_name"])
    ) {

        echo json_encode([
            "success" => false,
            "message" => "Medicine ID and medicine name are required"
        ]);

        exit;
    }


    $id = intval($data["id"]);

    $medicine_name = trim($data["medicine_name"]);
    $category = trim($data["category"] ?? "");
    $manufacturer = trim($data["manufacturer"] ?? "");

    $quantity = isset($data["quantity"])
        ? intval($data["quantity"])
        : 0;

    $price = isset($data["price"])
        ? floatval($data["price"])
        : 0;

    $expiry_date = !empty($data["expiry_date"])
        ? $data["expiry_date"]
        : null;


    if ($quantity < 0) {

        echo json_encode([
            "success" => false,
            "message" => "Quantity cannot be negative"
        ]);

        exit;
    }


    if ($price < 0) {

        echo json_encode([
            "success" => false,
            "message" => "Price cannot be negative"
        ]);

        exit;
    }


    /* Check Medicine */

    $check = $pdo->prepare(
        "SELECT id FROM medicines WHERE id = ?"
    );

    $check->execute([$id]);

    if (!$check->fetch()) {

        echo json_encode([
            "success" => false,
            "message" => "Medicine not found"
        ]);

        exit;
    }


    /* Update Medicine */

    $sql = "
        UPDATE medicines SET

            medicine_name = ?,
            category = ?,
            manufacturer = ?,
            quantity = ?,
            price = ?,
            expiry_date = ?

        WHERE id = ?
    ";


    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        $medicine_name,
        $category,
        $manufacturer,
        $quantity,
        $price,
        $expiry_date,
        $id
    ]);


    echo json_encode([
        "success" => true,
        "message" => "Medicine updated successfully"
    ]);

} catch (PDOException $e) {

    echo json_encode([
        "success" => false,
        "message" => "Failed to update medicine",
        "error" => $e->getMessage()
    ]);

}

?>