<?php

// I decided to use Flight for routing, but this can be used as a simple standalone router

function route($method, $route, $callback) {
    $output = [];
    
    $method = strtoupper($method);

    if ($_SERVER['REQUEST_METHOD'] != $method) {
        return;
    }

    $data = [
        "query" => $_GET,
        "body" => [],
    ];

    if (isset($_POST)) {
        $data["body"] = $_POST;
    }
    
    // break input and add to body
    $input = file_get_contents("php://input");
    if (strlen($input) > 0) {
        $input = explode("&", $input);
        foreach ($input as $key => $value) {
            $value = explode("=", $value);

            // decode url
            $value[0] = urldecode($value[0]);
            $value[1] = urldecode($value[1]);

            $data["body"][$value[0]] = $value[1];
        }
    }

    // break url and add to params
    $url = explode("/", $_SERVER["REQUEST_URI"]);
    array_shift($url); // remove first empty element
    
    // remove query params from url
    $url[count($url) - 1] = explode("?", $url[count($url) - 1])[0];


    $route = explode("/", $route);
    array_shift($route); // remove first empty element

    // match url and route
    if (count($url) != count($route)) {
        return;
    }

    // check if url matches route
    $params = [];
    foreach ($route as $value) {
        if (strpos($value, ":") === 0) {
            $params[substr($value, 1)] = array_shift($url);
        }
        else {
            $url_value = array_shift($url);
            if ($url_value != $value) {
                return;
            }
        }
    }

    $data["params"] = $params;

    // call callback
    $output = $callback($data);

    http_response_code( isset($output["status"]) ? $output["status"] : 200 );
    header('Content-Type: application/json');
    echo json_encode($output);
    exit;
}