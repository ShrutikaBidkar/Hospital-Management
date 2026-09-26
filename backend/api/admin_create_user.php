<?php

session_start();

header("Content-Type: application/json");

require_once "../config/database.php";


/* ADMIN ONLY */

if (
    !isset($_SESSION["role"]) ||
    $_SESSION["role"] !== "admin"
) {

    echo json_encode([
        "success" => false,
        "message" => "Admin access required."
    ]);

    exit;
}


/* GET DATA */

$data =
    json_decode(
        file_get_contents("php://input"),
        true
    );


$full_name =
    trim($data["full_name"] ?? "");

$username =
    trim($data["username"] ?? "");

$email =
    trim($data["email"] ?? "");

$phone =
    trim($data["phone"] ?? "");

$password =
    $data["password"] ?? "";

$role =
    strtolower(
        trim(
            $data["role"] ?? ""
        )
    );

$specialization =
    trim(
        $data["specialization"] ?? ""
    );


/* VALIDATION */

if (
    $full_name === "" ||
    $username === "" ||
    $email === "" ||
    $password === "" ||
    $role === ""
) {

    echo json_encode([
        "success" => false,
        "message" =>
            "Please fill all required fields."
    ]);

    exit;
}


/* ALLOWED STAFF */

$allowedRoles = [

    "doctor",
    "nurse",
    "receptionist"

];


if (
    !in_array(
        $role,
        $allowedRoles
    )
) {

    echo json_encode([
        "success" => false,
        "message" => "Invalid role."
    ]);

    exit;
}


/* DOCTOR SPECIALIZATION */

if (
    $role === "doctor" &&
    $specialization === ""
) {

    echo json_encode([
        "success" => false,
        "message" =>
            "Doctor specialization is required."
    ]);

    exit;
}


/* CHECK USERNAME */

$stmt =
    $pdo->prepare(
        "SELECT id
         FROM system_users
         WHERE username = ?"
    );

$stmt->execute([
    $username
]);


if ($stmt->fetch()) {

    echo json_encode([
        "success" => false,
        "message" =>
            "Username already exists."
    ]);

    exit;
}


/* CHECK EMAIL */

$stmt =
    $pdo->prepare(
        "SELECT id
         FROM system_users
         WHERE email = ?"
    );

$stmt->execute([
    $email
]);


if ($stmt->fetch()) {

    echo json_encode([
        "success" => false,
        "message" =>
            "Email already exists."
    ]);

    exit;
}


/* HASH PASSWORD */

$hashedPassword =
    password_hash(
        $password,
        PASSWORD_DEFAULT
    );


/* INSERT */

$stmt =
    $pdo->prepare(

        "INSERT INTO system_users
        (
            full_name,
            username,
            email,
            phone,
            password,
            role,
            specialization
        )
        VALUES
        (?, ?, ?, ?, ?, ?, ?)"

    );


$stmt->execute([

    $full_name,
    $username,
    $email,
    $phone,
    $hashedPassword,
    $role,
    $specialization

]);


echo json_encode([

    "success" => true,

    "message" =>
        ucfirst($role) .
        " account created successfully."

]);

?>