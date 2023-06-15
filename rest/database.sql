-- Active: 1685934706119@@127.0.0.1@3306@aula_ws
CREATE TABLE users(  
    id int NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255),
    email VARCHAR(255),
    password VARCHAR(255)
);