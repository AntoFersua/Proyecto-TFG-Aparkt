<?php
/**
 * Controlador para cambiar el email del usuario logueado.
 * Recibe el nuevo email desde el frontend.
 */

// Configuración de errores para desarrollo
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

// Verificar que el usuario está logueado
if (!isset($_SESSION['usuario_id'])) {
    echo json_encode(['success' => false, 'message' => 'No autorizado']);
    exit();
}

try {
    // Obtener el nuevo email del body de la petición
    $inputJSON = file_get_contents('php://input');
    $DatosPost = json_decode($inputJSON, true);
    $nuevoEmail = trim($DatosPost['email'] ?? '');

    // Validar que el email no esté vacío
    if (empty($nuevoEmail)) {
        echo json_encode(['success' => false, 'message' => 'El email no puede estar vacío']);
        exit();
    }

    // Validar formato básico de email
    if (!filter_var($nuevoEmail, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['success' => false, 'message' => 'El formato del email no es válido']);
        exit();
    }

    // Incluir modelos
    require_once __DIR__ . '/../models/Conexion.php';
    require_once __DIR__ . '/../models/Usuario.php';

    // Crear conexión e instanciar el modelo
    $conexion = require __DIR__ . '/../models/Conexion.php';
    $usuarioModel = new Usuario($conexion);

    // Verificar si el email ya está en uso por otro usuario
    if ($usuarioModel->existeEmail($nuevoEmail)) {
        echo json_encode(['success' => false, 'message' => 'Este email ya está en uso']);
        exit();
    }

    // Obtener el ID del usuario desde la sesión
    $usuarioId = $_SESSION['usuario_id'];

    // Actualizar el email
    $actualizado = $usuarioModel->actualizarEmail($usuarioId, $nuevoEmail);

    // Responder según el resultado
    if ($actualizado) {
        // Actualizar también el email en la sesión
        $_SESSION['usuario']['email'] = $nuevoEmail;
        echo json_encode(['success' => true, 'message' => 'Email actualizado correctamente']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error al actualizar el email']);
    }
} catch (Exception $e) {
    // Si hay algún error, devolver mensaje de error
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}