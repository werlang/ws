<?php

require "vendor/autoload.php";
// require "router.php";
require "connection.php";

use \Firebase\JWT\JWT;
use \Firebase\JWT\Key;

Flight::route("POST /users", function() {
    $body = Flight::request()->data;
    
    // check if user exists
    $sql = "SELECT * FROM users WHERE email = ?";
    $result = fetch($sql, [ $body["email"] ]);
    if (count($result) > 0) {
        Flight::json([
            "message" => "User already exists"
        ], 409);
        return;
    }

    // create user
    $sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
    $password = password_hash($body["password"], PASSWORD_DEFAULT);
    $id = query($sql, [ $body["name"], $body["email"], $password ]);

    Flight::json([
        "message" => "User created",
        "id" => $id
    ], 201);
});


Flight::route("POST /login", function() {
    $body = Flight::request()->data;

    // check if user exists
    $sql = "SELECT * FROM users WHERE email = ?";
    $result = fetch($sql, [ $body["email"] ]);
    if (count($result) == 0) {
        Flight::json([
            "message" => "User not found"
        ], 404);
        return;
    }

    $user = $result[0];
    if (!password_verify($body["password"], $user->password)) {
        Flight::json([
            "message" => "Invalid password"
        ], 401);
        return;
    }

    $payload = [
        "id" => $user->id,
        "exp" => time() + 60 * 60, // 1 hour
    ];

    global $config;
    $secretKey = $config["secretKey"];
    $jwt = JWT::encode($payload, $secretKey, "HS256");

    Flight::json([
        "message" => "User logged in",
        "token" => $jwt,
    ], 200);
});


function jwtVerify() {
    global $config;
    $secretKey = $config["secretKey"];

    $headers = getallheaders();
    if (!isset($headers["Authorization"])) {
        return Flight::json([
            "message" => "Invalid token"
        ], 401);
        exit;
    }
    $token = explode(" ", $headers["Authorization"])[1];
    try {
        $decoded = JWT::decode($token, new Key($secretKey, 'HS256'));
        return [
            "id" => $decoded->id,
        ];
    }
    catch (Exception $e) {
        // return $e;
        Flight::json([
            "message" => "Invalid token"
        ], 401);
        exit;
    }
}


Flight::route("GET /users", function() {
    $decoded = jwtVerify();

    $sql = "SELECT * FROM users WHERE id = ?";
    $result = fetch($sql, [ $decoded["id"] ]);

    if (count($result) == 0) {
        Flight::json([
            "message" => "User not found"
        ], 404);
        return;
    }

    $user = $result[0];

    Flight::json([
        "id" => $user->id,
        "name" => $user->name,
        "email" => $user->email,
    ], 200);
});


Flight::route("PUT /users", function() {
    $decoded = jwtVerify();
    
    // get raw input body and parse it
    parse_str(Flight::request()->getBody(), $body);
    
    $fields = [];
    $data = [];
    foreach ($body as $key => $value) {
        $fields[] = "$key = ?";
        $data[] = $value;
    }
    $fields = implode(", ", $fields);

    $sql = "UPDATE users SET $fields WHERE id = ?";

    if (count($data) == 0) {
        Flight::json([
            "message" => "No data to update"
        ], 400);
        return;
    }

    query($sql, [ ...$data, $decoded["id"] ]);

    Flight::json([ "message" => "User updated" ], 200);
});


Flight::route("DELETE /users", function() {
    $decoded = jwtVerify();

    $sql = "DELETE FROM users WHERE id = ?";
    query($sql, [ $decoded["id"] ]);

    Flight::json([ "message" => "User deleted" ], 200);
});


Flight::route("GET /users/search/@field", function($field) {
    if (!in_array($field, ["name", "email"])) {
        Flight::json([
            "message" => "Invalid field",
        ], 400);
        return;
    }
    
    // get query params
    $query = Flight::request()->query;

    if (!isset($query["value"])) {
        Flight::json([
            "message" => "Missing query value",
        ], 400);
        return;
    }

    $value = $query["value"];

    $sql = "SELECT * FROM users WHERE $field LIKE ?";
    $result = fetch($sql, [ "%$value%" ]);

    if (count($result) == 0) {
        Flight::json([
            "message" => "User not found"
        ], 404);
        return;
    }

    $list = [];
    foreach ($result as $user) {
        $list[] = $user->$field;
    }

    Flight::json($list, 200);
});


// Display custom 404 page
Flight::map('notFound', function(){
    Flight::json([ "error" => "Not found" ], 404);
});

Flight::start();
