<?php
//importar los archivos
require_once __DIR__ . '/../models/Conexion.php';
require_once __DIR__ . '/../models/Usuario.php';
require_once __DIR__ . '/../models/Vehiculo.php';
class LoginController
{
    private $usuarioModelo;
    public function __construct($conexion)
    {
        $this->usuarioModelo = new Usuario($conexion);
    }
    public function login()
    {
        header('Content-Type: application/json');

        try {
            // Obtener el contenido raw del body
            $inputJSON = file_get_contents('php://input');
            // Convertir a array asociativo
            $DatosPost = json_decode($inputJSON, true);
            $errores = [];
            //obtener datos del frontend
            $usuario = trim($DatosPost['usuario'] ?? '');
            $contrasena = trim($DatosPost['contrasena'] ?? '');

        //validaciones básicas
        if ($usuario == '') {
            $errores['usuario'] = "usuario_requerido";
        }
        if ($contrasena == '') {
            $errores['contrasena'] = "contrasena_requerida";
        }

        //si hay errores de validación básica, devolverlos
        if (!empty($errores)) {
            echo json_encode([
                "status" => "error",
                "errores" => $errores
            ]);
            exit();
        }

        // Validar que sea email
        if (strpos($usuario, '@') === false) {
            $errores['usuario'] = "email_invalido";
        }

        // Buscar por email
        $user_info = $this->usuarioModelo->obtenerUsuarioPorEmail($usuario);
        if (!$user_info) {
            $errores['usuario'] = "email_no_existe";
        }

        //si hay errores de email, devolverlos
        if (!empty($errores)) {
            echo json_encode([
                "status" => "error",
                "errores" => $errores
            ]);
            exit();
        }

        //verificar contraseña
        $contrasenaInfo = $this->usuarioModelo->verificarContrasena($contrasena, $user_info['contrasena']);
        if (!$contrasenaInfo) {
            $errores['contrasena'] = "contrasena_incorrecta";
        }

        //si hay errores de contraseña, devolverlos
        if (!empty($errores)) {
            echo json_encode([
                "status" => "error",
                "errores" => $errores
            ]);
            exit();
        }

        //Buscar si tiene vehiculo asociado
        $vehiculo_info = $this->usuarioModelo->obtenerVehiculosPorEmail($usuario);
        if (empty($vehiculo_info)) {
            $errores['vehiculo'] = "sin_vehiculo";
        }

        //si hay errores de vehiculo, devolverlos
        if (!empty($errores)) {
            echo json_encode([
                "status" => "error",
                "errores" => $errores
            ]);
            exit();
        }

        //si todo está bien, crear sesión
        session_set_cookie_params([
            'lifetime' => 0,
            'path' => '/',
            'secure' => false,
            'httponly' => true,
            'samesite' => 'Lax'
        ]);
        session_start();
        session_regenerate_id(true);
        $_SESSION["usuario"] = $usuario;
        $_SESSION["usuario_id"] = $user_info['id'];
        $_SESSION["vehiculo"] = $vehiculo_info;
        //devolver éxito
        echo json_encode([
            "status" => "ok",
            "loged" => true,
            "user" => $_SESSION['usuario'],
            "user_id" => $_SESSION['usuario_id'],
            "vehiculo_user" => $_SESSION['vehiculo'],
            "mensaje" => "login_exitoso"
        ]);
        } catch (PDOException $e) {
            echo json_encode([
                "status" => "error",
                "mensaje" => "error_bd"
            ]);
        }
    }
}
//Ejecuta automaticamente el proceso de login cuando se accede al archivo LoginController
if (basename($_SERVER['SCRIPT_FILENAME']) === 'LoginController.php') {
    $conexion = require __DIR__ . '/../models/Conexion.php';
    $controller = new LoginController($conexion);
    $controller->login();
}