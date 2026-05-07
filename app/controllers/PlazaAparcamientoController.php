<?php
session_start();

class PlazaAparcamientoController
{
    private $plazaModelo;
    private $puntuacionModelo;

    public function __construct($conexion)
    {
        require_once __DIR__ . '/../models/plazaAparcamiento.php';
        require_once __DIR__ . '/../models/SistemaPuntuacion.php';
        $this->plazaModelo = new PlazaAparcamiento($conexion);
        $this->puntuacionModelo = new SistemaPuntuacion($conexion);
    }

    public function crear()
    {
        $inputJSON = file_get_contents('php://input');
        $datos = json_decode($inputJSON, true);
        $errores = [];

        $ubicacion = trim($datos['ubicacion'] ?? '');
        $tipo = trim($datos['tipo'] ?? '');
        $tamano = $datos['tamano'] ?? null;
        $zonaId = $datos['zona_id'] ?? null;
        $sourceID = trim($datos['sourceID'] ?? '');
        $capaID = trim($datos['capaID'] ?? '');

        if ($ubicacion == '') {
            $errores['ubicacion'] = "La ubicación es obligatoria";
        }
        if ($tipo == '') {
            $errores['tipo'] = "El tipo es obligatorio";
        }
        if ($tamano === null || $tamano === '') {
            $errores['tamano'] = "El tamaño es obligatorio";
        }
        if ($zonaId === null || $zonaId === '') {
            $errores['zona_id'] = "La zona es obligatoria";
        }
        if ($sourceID == '') {
            $errores['sourceID'] = "El sourceID es obligatorio";
        }
        if ($capaID == '') {
            $errores['capaID'] = "El capaID es obligatorio";
        }

        header('Content-Type: application/json');

        if (!empty($errores)) {
            echo json_encode([
                "status" => "error",
                "errores" => $errores
            ]);
            exit();
        }

        $id = $this->plazaModelo->crearPlaza($ubicacion, $tipo, $tamano, $zonaId, $sourceID, $capaID);

        $usuarioId = $_SESSION['usuario_id'] ?? null;
        if ($usuarioId !== null) {
            $this->puntuacionModelo->sumandoPuntuacion(
                $usuarioId,
                SistemaPuntuacion::PUNTOS_CREAR,
                "Registrar plaza de aparcamiento"
            );
        }

        echo json_encode([
            "status" => "ok",
            "mensaje" => "Plaza creada",
            "id" => $id
        ]);
    }

    public function obtenerTodas()
    {
        header('Content-Type: application/json');

        $plazas = $this->plazaModelo->obtenerTodas();

        echo json_encode([
            "status" => "ok",
            "data" => $plazas
        ]);
    }

    public function obtenerPorId($id)
    {
        header('Content-Type: application/json');

        $plaza = $this->plazaModelo->obtenerPorId($id);

        if (!$plaza) {
            echo json_encode([
                "status" => "error",
                "mensaje" => "Plaza no encontrada"
            ]);
            exit();
        }

        echo json_encode([
            "status" => "ok",
            "data" => $plaza
        ]);
    }

    public function obtenerDisponibles()
    {
        header('Content-Type: application/json');

        $plazas = $this->plazaModelo->obtenerDisponibles();

        echo json_encode([
            "status" => "ok",
            "data" => $plazas
        ]);
    }

    public function obtenerPorZona($zonaId)
    {
        header('Content-Type: application/json');

        $plazas = $this->plazaModelo->obtenerPorZona($zonaId);

        echo json_encode([
            "status" => "ok",
            "data" => $plazas
        ]);
    }

    public function obtenerMisPlazas()
    {
        header('Content-Type: application/json');

        $usuarioId = $_SESSION['usuario_id'] ?? null;

        if ($usuarioId === null) {
            echo json_encode([
                "status" => "error",
                "mensaje" => "No hay sesión activa"
            ]);
            exit();
        }

        $plazas = $this->plazaModelo->obtenerPorUsuario($usuarioId);

        echo json_encode([
            "status" => "ok",
            "data" => $plazas
        ]);
    }

    public function actualizar()
    {
        $inputJSON = file_get_contents('php://input');
        $datos = json_decode($inputJSON, true);
        $errores = [];

        $id = $datos['id'] ?? null;
        $tipo = trim($datos['tipo'] ?? '');
        $tamano = $datos['tamano'] ?? null;
        $zonaId = $datos['zona_id'] ?? null;
        $sourceID = trim($datos['sourceID'] ?? '');
        $capaID = trim($datos['capaID'] ?? '');

        if ($id === null) {
            $errores['id'] = "El ID es obligatorio";
        }
        if ($tipo == '') {
            $errores['tipo'] = "El tipo es obligatorio";
        }
        if ($tamano === null || $tamano === '') {
            $errores['tamano'] = "El tamaño es obligatorio";
        }
        if ($zonaId === null || $zonaId === '') {
            $errores['zona_id'] = "La zona es obligatoria";
        }
        if ($sourceID == '') {
            $errores['sourceID'] = "El sourceID es obligatorio";
        }
        if ($capaID == '') {
            $errores['capaID'] = "El capaID es obligatorio";
        }

        header('Content-Type: application/json');

        if (!empty($errores)) {
            echo json_encode([
                "status" => "error",
                "errores" => $errores
            ]);
            exit();
        }

        $filas = $this->plazaModelo->actualizarPlaza($id, $tipo, $tamano, $zonaId, $sourceID, $capaID);

        echo json_encode([
            "status" => "ok",
            "mensaje" => "Plaza actualizada",
            "filas_afectadas" => $filas
        ]);
    }

    public function ocupar()
    {
        $inputJSON = file_get_contents('php://input');
        $datos = json_decode($inputJSON, true);

        $sourceID = $datos['sourceID'] ?? null;

        header('Content-Type: application/json');

        if ($sourceID === null) {
            echo json_encode([
                "status" => "error",
                "mensaje" => "El sourceID es incorrecto"
            ]);
            exit();
        }

        $usuarioID = $datos['usuarioID'];

        $filas = $this->plazaModelo->ocuparPlaza($sourceID, $usuarioID);

       /* $this->puntuacionModelo->sumandoPuntuacion(
            $usuarioId, //$usuarioID 
            SistemaPuntuacion::PUNTOS_OCUPAR,
            "Ocupar plaza de aparcamiento"
        );*/

        echo json_encode([
            "status" => "ok",
            "mensaje" => "Plaza ocupada",
            "filas_afectadas" => $filas
        ]);
    }

    public function liberar()
    {
        $inputJSON = file_get_contents('php://input');
        $datos = json_decode($inputJSON, true);

        $sourceID = $datos['sourceID'] ?? null;

        header('Content-Type: application/json');

        if ($sourceID === null) {
            echo json_encode([
                "status" => "error",
                "mensaje" => "El sourceID es incorrecto"
            ]);
            exit();
        }

        //posible cambio????
        /*$plaza = $this->plazaModelo->obtenerPorId($id);
        $esDueno = $plaza && $plaza['usuario_id'] == ($_SESSION['usuario_id'] ?? null);*/

        $filas = $this->plazaModelo->liberarPlaza($sourceID);

        /*if ($esDueno) {
            $this->puntuacionModelo->sumandoPuntuacion(
                $_SESSION['usuario_id'],
                SistemaPuntuacion::PUNTOS_LIBERAR,
                "Liberar plaza de aparcamiento"
            );
        }*/

        echo json_encode([
            "status" => "ok",
            "mensaje" => "Plaza liberada",
            "filas_afectadas" => $filas
        ]);
    }

    public function eliminar()
    {
        $inputJSON = file_get_contents('php://input');
        $datos = json_decode($inputJSON, true);

        $id = $datos['id'] ?? null;

        header('Content-Type: application/json');

        if ($id === null) {
            echo json_encode([
                "status" => "error",
                "mensaje" => "El ID es obligatorio"
            ]);
            exit();
        }

        $filas = $this->plazaModelo->eliminarPlaza($id);

        echo json_encode([
            "status" => "ok",
            "mensaje" => "Plaza eliminada",
            "filas_afectadas" => $filas
        ]);
    }
}

if (basename($_SERVER['SCRIPT_FILENAME']) === 'PlazaAparcamientoController.php') {
    $conexion = require __DIR__ . '/../models/Conexion.php';
    $controller = new PlazaAparcamientoController($conexion);

    $metodo = $_SERVER['REQUEST_METHOD'];
    $action = $_GET['action'] ?? '';

    switch ($metodo) {
        case 'GET':
            if ($action === 'disponibles') {
                $controller->obtenerDisponibles();
            } elseif ($action === 'mis-plazas') {
                $controller->obtenerMisPlazas();
            } elseif ($action === 'zona' && isset($_GET['zona_id'])) {
                $controller->obtenerPorZona($_GET['zona_id']);
            } elseif (isset($_GET['id'])) {
                $controller->obtenerPorId($_GET['id']);
            } else {
                $controller->obtenerTodas();
            }
            break;
        case 'POST':
            if ($action === 'crear') {
                $controller->crear();
            } elseif ($action === 'ocupar') {
                $controller->ocupar();
            } elseif ($action === 'liberar') {
                $controller->liberar();
            } else {
                $controller->crear();
            }
            break;
        case 'PUT':
            $controller->actualizar();
            break;
        case 'DELETE':
            $controller->eliminar();
            break;
        default:
            header('HTTP/1.1 405 Method Not Allowed');
            echo json_encode(["status" => "error", "mensaje" => "Método no permitido"]);
            break;
    }
}
