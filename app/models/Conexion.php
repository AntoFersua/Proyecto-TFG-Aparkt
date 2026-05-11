<?php

    $_servidor = getenv('MYSQLHOST') ?: getenv('MYSQL_HOST') ?: 'localhost';
    $_usuario = getenv('MYSQLUSER') ?: getenv('MYSQL_USER') ?: 'root';
    $_contrasena = getenv('MYSQLPASSWORD') ?: getenv('MYSQL_PASSWORD') ?: '';
    $_bd = getenv('MYSQLDATABASE') ?: getenv('MYSQL_DATABASE') ?: 'aparkt';
    $_puerto = getenv('MYSQLPORT') ?: getenv('MYSQL_PORT') ?: '3306';

    try {
        $_conexion = new PDO(
            "mysql:host=$_servidor;port=$_puerto;dbname=$_bd;charset=utf8mb4",
            $_usuario,
            $_contrasena
        );

        //Configurar el lanzamiento de excepciones
        $_conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        //Configurar por defecto FETCH_ASSOC
        $_conexion->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

        //Comprobar que funciona
        //echo "Todo funciona correctamente. Estás conectado! <br>";

    } catch (PDOException $e) {
        header('Content-Type: application/json');
        echo json_encode(["status" => "error", "mensaje" => "Error de conexión: " . $e->getMessage()]);
        exit();
    }

    return $_conexion;
?>
