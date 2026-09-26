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


    if (empty($data["medicine_name"])) {

        echo json_encode([
            "success" => false,
            "message" => "Medicine name is required"
        ]);

        exit;
    }


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


    $sql = "
        INSERT INTO medicines
        (
            medicine_name,
            category,
            manufacturer,
            quantity,
            price,
            expiry_date
        )
        VALUES (?, ?, ?, ?, ?, ?)
    ";


    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        $medicine_name,
        $category,
        $manufacturer,
        $quantity,
        $price,
        $expiry_date
    ]);


    echo json_encode([
        "success" => true,
        "message" => "Medicine added successfully",
        "medicine_id" => $pdo->lastInsertId()
    ]);

} catch (PDOException $e) {

    echo json_encode([
        "success" => false,
        "message" => "Failed to add medicine",
        "error" => $e->getMessage()
    ]);

}

?>