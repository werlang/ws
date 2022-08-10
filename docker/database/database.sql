CREATE DATABASE aula_ws;

USE aula_ws;

CREATE TABLE users (
    id INT auto_increment PRIMARY KEY,
    name VARCHAR(45),
    email VARCHAR(45),
    password VARCHAR(45)
);