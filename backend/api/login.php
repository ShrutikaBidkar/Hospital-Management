<?php

session_start();

header("Content-Type: application/json");

require_once "../config/database.php";

try {

    // JSON data receive
    $input = json_decode(file_get_contents("php://input"), true);

    $username = trim($input["username"] ?? "");
    $password = trim($input["password"] ?? "");
    $role = strtolower(trim($input["role"] ?? ""));

    // Validation
    if ($username === "" || $password === "" || $role === "") {

        echo json_encode([
            "success" => false,
            "message" => "Username, password and role are required"
        ]);

        exit;
    }


    /* =====================================================
       ADMIN LOGIN
       Admin is STATIC
       ===================================================== */

    if ($role === "admin") {

        if ($username === "admin" && $password === "admin123") {

            $_SESSION["user"] = [
                "id" => 0,
                "username" => "admin",
                "role" => "admin"
            ];

            echo json_encode([
                "success" => true,
                "message" => "Admin login successful",
                "user" => [
                    "id" => 0,
                    "username" => "admin",
                    "role" => "admin"
                ]
            ]);

            exit;

        } else {

            echo json_encode([
                "success" => false,
                "message" => "Invalid admin username or password"
            ]);

            exit;
        }
    }


    /* =====================================================
       NURSE LOGIN
       Existing nurse table
       ===================================================== */

    if ($role === "nurse") {

        $sql = "SELECT id, username, password
                FROM nurse
                WHERE username = ?
                LIMIT 1";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([$username]);

        $nurse = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$nurse) {

            echo json_encode([
                "success" => false,
                "message" => "Nurse username not found"
            ]);

            exit;
        }

        // Current database has plain passwords
        if ($password !== $nurse["password"]) {

            echo json_encode([
                "success" => false,
                "message" => "Invalid nurse password"
            ]);

            exit;
        }

        $_SESSION["user"] = [
            "id" => $nurse["id"],
            "username" => $nurse["username"],
            "role" => "nurse"
        ];

        echo json_encode([
            "success" => true,
            "message" => "Nurse login successful",
            "user" => [
                "id" => $nurse["id"],
                "username" => $nurse["username"],
                "role" => "nurse"
            ]
        ]);

        exit;
    }


    /* =====================================================
       DOCTOR LOGIN
       Existing doctors table
       ===================================================== */

    if ($role === "doctor") {

        $sql = "SELECT id, doctor_code, first_name, last_name,
                       username, password
                FROM doctors
                WHERE username = ?
                LIMIT 1";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([$username]);

        $doctor = $stmt->fetch(PDO::FETCH_ASSOC);

        // Doctor username not found
        if (!$doctor) {

            echo json_encode([
                "success" => false,
                "message" => "Doctor username not found"
            ]);

            exit;
        }

        // Current database has plain passwords
        if ($password !== $doctor["password"]) {

            echo json_encode([
                "success" => false,
                "message" => "Invalid doctor password"
            ]);

            exit;
        }

        // Store doctor information in session
        $_SESSION["user"] = [
            "id" => $doctor["id"],
            "username" => $doctor["username"],
            "role" => "doctor",
            "doctor_code" => $doctor["doctor_code"],
            "name" => $doctor["first_name"] . " " . $doctor["last_name"]
        ];

        echo json_encode([
            "success" => true,
            "message" => "Doctor login successful",
            "user" => [
                "id" => $doctor["id"],
                "username" => $doctor["username"],
                "role" => "doctor",
                "doctor_code" => $doctor["doctor_code"],
                "name" => $doctor["first_name"] . " " . $doctor["last_name"]
            ]
        ]);

        exit;
    }
         
    /* ================= RECEPTIONIST LOGIN ================= */

if ($role === "receptionist") {

    $sql = "SELECT id, username, password
            FROM receptionist
            WHERE username = ?
            LIMIT 1";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([$username]);

    $receptionist = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$receptionist) {
        echo json_encode([
            "success" => false,
            "message" => "Receptionist username not found"
        ]);
        exit;
    }

    if ($password !== $receptionist["password"]) {
        echo json_encode([
            "success" => false,
            "message" => "Invalid receptionist password"
        ]);
        exit;
    }

    $_SESSION["user"] = [
        "id" => $receptionist["id"],
        "username" => $receptionist["username"],
        "role" => "receptionist",
        "name" => $receptionist["username"]
    ];

    echo json_encode([
        "success" => true,
        "message" => "Receptionist login successful",
        "user" => [
            "id" => $receptionist["id"],
            "username" => $receptionist["username"],
            "role" => "receptionist",
            "name" => $receptionist["username"]
        ]
    ]);

    exit;
}

    /* =====================================================
       OTHER ROLES
       ===================================================== */

    echo json_encode([
        "success" => false,
        "message" => "This role is not configured yet"
    ]);

} catch (PDOException $e) {

    echo json_encode([
        "success" => false,
        "message" => "Database error: " . $e->getMessage()
    ]);

} catch (Exception $e) {

    echo json_encode([
        "success" => false,
        "message" => "Server error: " . $e->getMessage()
    ]);
}

?>