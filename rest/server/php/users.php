<?php

require "connection.php";

$method = $_SERVER['REQUEST_METHOD'];

if ($method == "GET") {
    $action = "get";
}
else if ($method == "POST") {
    $action = "insert";
}
else if ($method == "PUT") {
    $action = "update";
}
else if ($method == "DELETE") {
    $action = "delete";
}

$output = [ "message" => "unsupported action", "status" => 404 ];

if ($action === "get") {
    $field = false;
    $available_args = ['id', 'name', 'email'];
    
    if (isset($_GET["id"])) {
        $field = $_GET["id"];
    }
    
    $field_sql = "";
    $field_data = [];
    if ($field) {
        $field_sql = "WHERE id = ?";
        $field_data = [ $field ];
    }

    $sql = "SELECT * FROM users $field_sql";
    $query = $conn->prepare($sql);
    $query->execute($field_data);

    $count = 0;
    $output["results"] = [];
    while ($result = $query->fetch(PDO::FETCH_OBJ)) {
        $row = [];
        foreach ($result as $key => $value) {
            $row[$key] = $value;
        }
        $output["results"][$count] = $row;
        $count++;
    }

    $output["status"] = 200;
    $output["message"] = "OK";
}
else if ($action === "insert") {
    if (!isset($_POST["name"]) || !isset($_POST["email"]) || !isset($_POST["password"])) {
        $output["message"] = "Must inform all fields";
        $output["status"] = 400;
    }
    else {
        $sql = "INSERT INTO users (name,email,password) VALUES (:name,:email,:password)";
        $query = $conn->prepare($sql);
        $user = [
            "name" => $_POST["name"],
            "email" => $_POST["email"],
            "password" => $_POST["password"]
        ];
        $query->execute($user);
        $output["status"] = 201;
        $output["message"] = "User created";
        $user["id"] = $conn->lastInsertId();
        $output["result"] = $user;
    }
}
else if ($action === "update") {
    // get input from put method
    parse_str(file_get_contents("php://input"), $data);
    
    $output["message"] = "Must inform user id";
    $output["status"] = 400;
    if (isset($data["id"])) {
        $id = $data["id"];
        unset($data["id"]);
        foreach ($data as $field => $value) {
            $sql = "UPDATE users SET $field = ? WHERE id = ?";
            $query = $conn->prepare($sql);
            $query->execute([ $value, $id ]);
            $output["result"][$field] = $value;
        }
        $output["message"] = "User edited";
        $output["status"] = 200;
        $output["result"]["user"] = $id;
    }
}
else if ($action === "delete") {
    parse_str(file_get_contents("php://input"), $data);

    $output["message"] = "Must inform user id";
    $output["status"] = 400;
    if (isset($data["id"])) {
        $sql = "DELETE FROM users WHERE id = ?";
        $query = $conn->prepare($sql);
        $query->execute([ $data["id"] ]);
        $output["message"] = "User deleted";
        $output["status"] = 204;
    }
}

http_response_code($output["status"]);
header('Content-Type: application/json');
echo json_encode($output);