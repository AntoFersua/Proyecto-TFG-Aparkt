<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

session_set_cookie_params([
    'lifetime' => 0,
    'path' => '/',
    'secure' => false,
    'httponly' => true,
    'samesite' => 'Lax'
]);
session_start();

header('Content-Type: application/json');

if (!isset($_SESSION['usuario_id'])) {
    echo json_encode(['success' => false, 'message' => 'No autorizado']);
    exit();
}

try {
    $inputJSON = file_get_contents('php://input');
    $DatosPost = json_decode($inputJSON, true);
    $passwordActual = trim($DatosPost['passwordActual'] ?? '');
    $passwordNueva = trim($DatosPost['passwordNueva'] ?? '');

    if (empty($passwordActual) || empty($passwordNueva)) {
        echo json_encode(['success' => false, 'message' => 'Todos los campos son obligatorios']);
        exit();
    }

    if (!preg_match('/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{6,15}$/', $passwordNueva)) {
        echo json_encode(['success' => false, 'message' => 'Mínimo 6 y máximo 15 caracteres, al menos una mayúscula, una minúscula, un número y un símbolo (@!?%)']);
        exit();
    }

    require_once __DIR__ . '/../models/Conexion.php';
    require_once __DIR__ . '/../models/Usuario.php';

    $conexion = require __DIR__ . '/../models/Conexion.php';
    $usuarioModel = new Usuario($conexion);

    $usuarioId = $_SESSION['usuario_id'];
    $usuario = $usuarioModel->obtenerUsuarioPorId($usuarioId);

    if (!$usuario) {
        echo json_encode(['success' => false, 'message' => 'Usuario no encontrado']);
        exit();
    }

    if (!$usuarioModel->verificarContrasena($passwordActual, $usuario['contrasena'])) {
        echo json_encode(['success' => false, 'message' => 'La contraseña actual no es correcta']);
        exit();
    }

    $passwordHasheada = password_hash($passwordNueva, PASSWORD_DEFAULT);
    $actualizado = $usuarioModel->actualizarPassword($usuarioId, $passwordHasheada);

    if ($actualizado) {
        echo json_encode(['success' => true, 'message' => 'Contraseña actualizada correctamente']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error al actualizar la contraseña']);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
