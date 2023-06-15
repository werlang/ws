<?php

$config = file_get_contents('config.json');
$config = json_decode($config, true);

$host = $config["mysql"]['host'];
$database = $config["mysql"]['database'];
$user = $config["mysql"]['user'];
$password = $config["mysql"]['password'];

$conn = new PDO(
    "mysql:host=$host;dbname=$database",
    $user,
    $password
);

function query($sql, $data = []) {
    global $conn;
    $query = $conn->prepare($sql);
    $query->execute($data);

    if ($id = $conn->lastInsertId()) {
        return $id;
    }

    return $query;
}

function fetch($sql, $data = []) {
    $query = query($sql, $data);
    return $query->fetchAll(PDO::FETCH_OBJ);
}