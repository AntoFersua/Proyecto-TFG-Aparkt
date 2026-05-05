<?php
/**
 * MeController.php
 * 
 * Este archivo se usa para verificar si el usuario tiene una sesión activa.
 * Devuelve un JSON con la información de la sesión.
 * 
 * El frontend (auth.js) llama a este endpoint para saber si el usuario está logueado.
 */

// Configuración de sesión - permite cookies en todo el dominio
session_set_cookie_params([
    'lifetime' => 0,
    'path' => '/',
    'secure' => false,
    'httponly' => true,
    'samesite' => 'Lax'
]);
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);

// Inicia o recupera la sesión actual del usuario
session_start();

// Establece que la respuesta será JSON
header('Content-Type: application/json');

// Comprueba si existe la variable de sesión "usuario"
// Esta variable se crea en LoginController.php cuando el usuario hace login correctamente
$logueado = isset($_SESSION['usuario']) && !empty($_SESSION['usuario']);

$response = [
    'logueado' => $logueado,
    'usuario' => $logueado ? $_SESSION['usuario'] : null,
    'session_id' => session_id(),
    'session_contents' => $_SESSION,
    'cookies' => $_COOKIE
];

// If user is logged in, also fetch their score
if ($logueado && isset($_SESSION['usuario_id'])) {
    require_once __DIR__ . '/../models/Conexion.php';
    $conexion = require __DIR__ . '/../models/Conexion.php';
    require_once __DIR__ . '/../models/SistemaPuntuacion.php';
    $puntuacionModel = new SistemaPuntuacion($conexion);
    $response['puntuacion'] = $puntuacionModel->obtenerPuntuacion($_SESSION['usuario_id']);
    $response['usuario_id'] = $_SESSION['usuario_id'];
    $response['puntosCrear'] = SistemaPuntuacion::PUNTOS_CREAR;
    $response['puntosOcupar'] = SistemaPuntuacion::PUNTOS_OCUPAR;
    $response['puntosLiberar'] = SistemaPuntuacion::PUNTOS_LIBERAR;
}

echo json_encode($response);