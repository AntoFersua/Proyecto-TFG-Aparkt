<?php
/**
 * Controlador para eliminar el vehículo del usuario logueado.
 * Obtiene el ID del usuario desde la sesión.
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

// Configuración de cookies de sesión
session_set_cookie_params([
    'lifetime' => 0,
    'path' => '/',
    'secure' => false,
    'httponly' => true,
    'samesite' => 'Lax'
]);
session_start();

// Establecer que la respuesta será JSON
header('Content-Type: application/json');

// Verificar que el usuario está logueado (tiene sesión)
if (!isset($_SESSION['usuario_id'])) {
    echo json_encode(['success' => false, 'message' => 'No autorizado']);
    exit();
}

try {
    // Incluir el modelo de Vehiculo
    require_once __DIR__ . '/../models/Vehiculo.php';

    // Crear conexión e instanciar el modelo
    $conexion = require __DIR__ . '/../models/Conexion.php';
    $vehiculoModel = new Vehiculo($conexion);

    // Obtener el ID del usuario desde la sesión
    $usuarioId = $_SESSION['usuario_id'];

    // Obtener los vehículos del usuario
    $vehiculos = $vehiculoModel->obtenerPorUsuario($usuarioId);
    
    // Si no tiene vehículos, mostrar error
    if (empty($vehiculos)) {
        echo json_encode(['success' => false, 'message' => 'No tienes ningún vehículo registrado']);
        exit();
    }

    // Obtener el ID del primer vehículo (solo puede tener uno)
    $vehiculoId = $vehiculos[0]['id'];
    
    // Eliminar el vehículo
    $eliminado = $vehiculoModel->eliminarVehiculo($vehiculoId, $usuarioId);

    // Responder según el resultado
    if ($eliminado) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error al eliminar vehículo']);
    }
} catch (Exception $e) {
    // Si hay algún error, devolver mensaje de error
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}