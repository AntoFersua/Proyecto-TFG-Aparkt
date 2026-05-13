<?php

require_once __DIR__ . "/Conexion.php";
require_once __DIR__ . "/Model.php";

class Vehiculo extends Model
{
    // CREATE
    public function crearVehiculo($usuarioId, $tipoVehiculo, $tamano, $plazaId = null)
    {
        $consulta = "INSERT INTO Vehiculo 
                (usuario_id, tipo_vehiculo, tamano, plaza_aparcamiento_id)
                VALUES (:usuario_id, :tipo_vehiculo, :tamano, :plaza_id)";

        $stmt = $this->_conexion->prepare($consulta);

        $stmt->bindValue(":usuario_id", $usuarioId, PDO::PARAM_INT);
        $stmt->bindValue(":tipo_vehiculo", $tipoVehiculo, PDO::PARAM_STR);
        $stmt->bindValue(":tamano", $tamano, PDO::PARAM_STR);

        if ($plazaId === null) {
            $stmt->bindValue(":plaza_id", null, PDO::PARAM_NULL);
        } else {
            $stmt->bindValue(":plaza_id", $plazaId, PDO::PARAM_INT);
        }

        $stmt->execute();
        $id = $this->_conexion->lastInsertId();
        
        return $id;
    }

    // READ: todos por usuario
    public function obtenerPorUsuario($usuarioId)
    {
        $consulta = "SELECT * FROM Vehiculo WHERE usuario_id = :usuario_id";

        $stmt = $this->_conexion->prepare($consulta);
        $stmt->bindValue(":usuario_id", $usuarioId, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // READ: uno por id
    public function obtenerPorId($id, $usuarioId)
    {
        $consulta = "SELECT * FROM Vehiculo 
                WHERE id = :id AND usuario_id = :usuario_id";

        $stmt = $this->_conexion->prepare($consulta);
        $stmt->bindValue(":id", $id, PDO::PARAM_INT);
        $stmt->bindValue(":usuario_id", $usuarioId, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // UPDATE
    public function actualizarVehiculo($id, $usuarioId, $tipoVehiculo, $tamano, $plazaId = null)
    {
        $consulta = "UPDATE Vehiculo 
                SET tipo_vehiculo = :tipo_vehiculo,
                    tamano = :tamano,
                    plaza_aparcamiento_id = :plaza_id
                WHERE id = :id AND usuario_id = :usuario_id";

        $stmt = $this->_conexion->prepare($consulta);

        $stmt->bindValue(":id", $id, PDO::PARAM_INT);
        $stmt->bindValue(":usuario_id", $usuarioId, PDO::PARAM_INT);
        $stmt->bindValue(":tipo_vehiculo", $tipoVehiculo, PDO::PARAM_STR);
        $stmt->bindValue(":tamano", $tamano, PDO::PARAM_STR);

        if ($plazaId === null) {
            $stmt->bindValue(":plaza_id", null, PDO::PARAM_NULL);
        } else {
            $stmt->bindValue(":plaza_id", $plazaId, PDO::PARAM_INT);
        }

        $stmt->execute();

        return $stmt->rowCount();
    }

    // DELETE
    public function eliminarVehiculo($id, $usuarioId)
    {
        $consulta = "DELETE FROM Vehiculo 
                WHERE id = :id AND usuario_id = :usuario_id";

        $stmt = $this->_conexion->prepare($consulta);
        $stmt->bindValue(":id", $id, PDO::PARAM_INT);
        $stmt->bindValue(":usuario_id", $usuarioId, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->rowCount();
    }
}