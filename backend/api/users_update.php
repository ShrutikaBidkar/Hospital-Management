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


    $id = intval($data["id"] ?? 0);
    $username = trim($data["username"] ?? "");
    $password = $data["password"] ?? "";
    $role = $data["role"] ?? "";


    if (
        empty($id) ||
        empty($username) ||
        empty($role)
    ) {

        echo json_encode([
            "success" => false,
            "message" => "User ID, username and role are required"
        ]);

        exit;
    }


    if ($role !== "Admin" && $role !== "Nurse") {

        echo json_encode([
            "success" => false,
            "message" => "Invalid role"
        ]);

        exit;
    }


    $table = ($role === "Admin")
        ? "admin"
        : "nurse";


    /* Check current user */

    $checkUser = $pdo->prepare(
        "SELECT id FROM $table WHERE id = ?"
    );

    $checkUser->execute([$id]);


    if (!$checkUser->fetch()) {

        echo json_encode([
            "success" => false,
            "message" => "User not found"
        ]);

        exit;
    }


    /* Check duplicate username in Admin */

    $checkAdmin = $pdo->prepare(
        "SELECT id FROM admin
         WHERE username = ?
         AND NOT (id = ? AND ? = 'Admin')"
    );

    $checkAdmin->execute([
        $username,
        $id,
        $role
    ]);


    if ($checkAdmin->fetch()) {

        echo json_encode([
            "success" => false,
            "message" => "Username already exists"
        ]);

        exit;
    }


    /* Check duplicate username in Nurse */

    $checkNurse = $pdo->prepare(
        "SELECT id FROM nurse
         WHERE username = ?
         AND NOT (id = ? AND ? = 'Nurse')"
    );

    $checkNurse->execute([
        $username,
        $id,
        $role
    ]);


    if ($checkNurse->fetch()) {

        echo json_encode([
            "success" => false,
            "message" => "Username already exists"
        ]);

        exit;
    }


    /*
       If role is changed, move user
       from one table to another.
    */

    if ($role === "Admin") {

        $oldTable = "nurse";

    } else {

        $oldTable = "admin";
    }


    /*
       Check whether user exists in the opposite table.
       If current user already belongs to selected role,
       simply update it.
    */

    if ($role === "Admin") {

        $currentTable = "admin";
        $otherTable = "nurse";

    } else {

        $currentTable = "nurse";
        $otherTable = "admin";
    }


    $currentCheck = $pdo->prepare(
        "SELECT id, password
         FROM $currentTable
         WHERE id = ?"
    );

    $currentCheck->execute([$id]);

    $currentUser = $currentCheck->fetch();


    if ($currentUser) {

        /* Same role */

        if (!empty($password)) {

            $hashedPassword = password_hash(
                $password,
                PASSWORD_DEFAULT
            );

            $stmt = $pdo->prepare(
                "UPDATE $currentTable
                 SET username = ?, password = ?
                 WHERE id = ?"
            );

            $stmt->execute([
                $username,
                $hashedPassword,
                $id
            ]);

        } else {

            $stmt = $pdo->prepare(
                "UPDATE $currentTable
                 SET username = ?
                 WHERE id = ?"
            );

            $stmt->execute([
                $username,
                $id
            ]);
        }


        echo json_encode([
            "success" => true,
            "message" => "User updated successfully"
        ]);

        exit;
    }


    echo json_encode([
        "success" => false,
        "message" => "User role or ID does not match"
    ]);


} catch (PDOException $e) {

    echo json_encode([
        "success" => false,
        "message" => "Failed to update user",
        "error" => $e->getMessage()
    ]);

}

?>
