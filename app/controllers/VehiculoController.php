<?php
session_start();

class VehiculoController
{
    private $vehiculoModelo;
    public function __construct($conexion)
    {
        require_once __DIR__ . '/../models/Vehiculo.php';
        $this->vehiculoModelo = new Vehiculo($conexion);
    }
    public function crear()
    {
        $inputJSON = file_get_contents('php://input');
        $DatosPost = json_decode($inputJSON, true);
        $errores = [];
        $tipoVehiculo = trim($DatosPost['tipoVehiculo'] ?? '');
        $tamano = trim($DatosPost['tamano'] ?? '');

        if ($tipoVehiculo == '') {
            $errores['tipoVehiculo'] = "El tipo de vehículo es obligatorio";
        }
        if ($tamano == '') {
            $errores['tamano'] = "El tamaño es obligatorio";
        }

        header('Content-Type: application/json');

        if (!empty($errores)) {
            echo json_encode([
                "status" => "error",
                "errores" => $errores
            ]);
            exit();
        }

        $usuarioId = $_SESSION['usuario_id'] ?? null;

        if ($usuarioId === null) {
            echo json_encode([
                "status" => "error",
                "mensaje" => "No hay sesión activa. Por favor, inicia sesión.",
                "debug" => "session_id: " . session_id() . ", session: " . json_encode($_SESSION)
            ]);
            exit();
        }

        // Limitar a un vehículo por usuario
        $vehiculosExistentes = $this->vehiculoModelo->obtenerPorUsuario($usuarioId);
        if (!empty($vehiculosExistentes)) {
            echo json_encode([
                "status" => "error",
                "mensaje" => "Ya tienes un vehículo registrado. Solo puedes tener uno."
            ]);
            exit();
        }

        // Crear el vehículo si no existe ninguno
        $id = $this->vehiculoModelo->crearVehiculo($usuarioId, $tipoVehiculo, $tamano);

        echo json_encode([
            "status" => "ok",
            "mensaje" => "Vehículo creado",
            "id" => $id,
            "debug" => ["usuarioId" => $usuarioId, "tipo" => $tipoVehiculo, "tamano" => $tamano]
        ]);
    }
}

if (basename($_SERVER['SCRIPT_FILENAME']) === 'VehiculoController.php') {
    $conexion = require __DIR__ . '/../models/Conexion.php';
    $controller = new VehiculoController($conexion);
    $controller->crear();
}