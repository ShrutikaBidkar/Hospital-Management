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


    if (empty($data["id"])) {

        echo json_encode([
            "success" => false,
            "message" => "Admission ID is required"
        ]);

        exit;
    }


    $id =
        intval($data["id"]);


    // Check admission

    $check = $pdo->prepare(
        "SELECT id, status
         FROM admissions
         WHERE id = ?"
    );

    $check->execute([
        $id
    ]);


    $admission =
        $check->fetch();


    if (!$admission) {

        echo json_encode([
            "success" => false,
            "message" => "Admission not found"
        ]);

        exit;
    }


    if ($admission["status"] === "Discharged") {

        echo json_encode([
            "success" => false,
            "message" => "Patient is already discharged"
        ]);

        exit;
    }


    // Discharge patient

    $sql = "UPDATE admissions SET

                discharge_date = CURDATE(),
                status = 'Discharged'

            WHERE id = ?";


    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        $id
    ]);


    echo json_encode([
        "success" => true,
        "message" => "Patient discharged successfully"
    ]);

} catch (PDOException $e) {

    echo json_encode([
        "success" => false,
        "message" => "Failed to discharge patient",
        "error" => $e->getMessage()
    ]);

}

?>