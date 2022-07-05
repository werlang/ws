<?php

function getUsers() {
    $url = "https://gorest.co.in/public/v2/users";

    $curl = curl_init();
    curl_setopt($curl, CURLOPT_URL, $url);
    $result = curl_exec($curl);
    curl_close($curl);

    return $result;
}

function postUser() {
    $body = [
        "name" => "Foo Bar Silva",
        "email" => "foo2@bar.ifsul.edu.br",
        "gender" => "male",
        "status" => "active"
    ];

    $key = json_decode(file_get_contents("config.json"), true)["apiKey"];
    
    $headers = [
        "Authorization: Bearer e5358422739f28ac531a812f055da677469ef403919b1392d2c60eb8cc65950d",
        "Content-Type: application/json"
    ];

    $url = "https://gorest.co.in/public/v2/users";

    $curl = curl_init();
    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "POST");
    curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($body));

    $result = curl_exec($curl);
    curl_close($curl);

    return $result;
}

// echo json_encode(getUsers());
echo postUser();