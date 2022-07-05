<?php
// cuidado. esse arquivo tem informação crítica de segurança.
// colocar ele no gitignore caso use em produção
$host = "localhost";
$user = "aula";
$password = "asdf1234";
$database = "aula_pwii";

$conn = new PDO(
    "mysql:host=$host;dbname=$database",
    $user,
    $password
);