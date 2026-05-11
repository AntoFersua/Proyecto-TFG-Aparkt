<?php

require_once __DIR__ . "/Conexion.php";
require_once __DIR__ . "/Model.php";

class PlazaAparcamiento extends Model
{
    public function crearPlaza($ubicacion, $tipo, $tamano, $zonaId, $sourceID, $capaID, $usuarioId = null)
    {
        $consulta = "INSERT INTO PlazaAparcamiento (ubicacion, tipo, tamano, zona_id, sourceID, capaID, usuario_id) 
                VALUES (ST_GeomFromText(:ubicacion), :tipo, :tamano, :zona_id, :sourceID, :capaID, :usuario_id)";

        $stmt = $this->_conexion->prepare($consulta);

        $stmt->bindValue(":ubicacion", $ubicacion, PDO::PARAM_STR);
        $stmt->bindValue(":tipo", $tipo, PDO::PARAM_STR);
        $stmt->bindValue(":tamano", $tamano, PDO::PARAM_INT);
        $stmt->bindValue(":zona_id", $zonaId, PDO::PARAM_INT);
        $stmt->bindValue(":sourceID", $sourceID, PDO::PARAM_STR);
        $stmt->bindValue(":capaID", $capaID, PDO::PARAM_STR);

        if ($usuarioId === null) {
            $stmt->bindValue(":usuario_id", null, PDO::PARAM_NULL);
        } else {
            $stmt->bindValue(":usuario_id", $usuarioId, PDO::PARAM_INT);
        }

        $stmt->execute();
        return $this->_conexion->lastInsertId();
    }

    public function obtenerTodas()
    {   
        /**ST_X y ST_Y son funciones de MySQL Spatial que permiten extraer las coordenadas de un 
         * campo de tipo POINT. Este tipo de dato guarda la ubicación como (longitud, latitud). 
         * ST_X devuelve la longitud y ST_Y devuelve la latitud. */
        $consulta = "SELECT p.id, ST_AsText(p.ubicacion) AS ubicacion, ST_X(p.ubicacion) AS longitud, ST_Y(p.ubicacion) AS latitud,
                    p.tamano, p.sourceID, p.capaID, p.tipo, p.zona_id, p.ocupado, p.usuario_id, p.hora_reporte, z.id AS zona_id
                    FROM PlazaAparcamiento p
                    LEFT JOIN Zona z ON p.zona_id = z.id";

        $stmt = $this->_conexion->prepare($consulta);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function obtenerPorId($id)
    {
        $consulta = "SELECT p.*, ST_X(p.ubicacion) as latitud, ST_Y(p.ubicacion) as longitud
                    FROM PlazaAparcamiento p
                    WHERE p.id = :id";

        $stmt = $this->_conexion->prepare($consulta);
        $stmt->bindValue(":id", $id, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function obtenerPorZona($zonaId)
    {
        $consulta = "SELECT p.*, ST_X(p.ubicacion) as latitud, ST_Y(p.ubicacion) as longitud
                    FROM PlazaAparcamiento p
                    WHERE p.zona_id = :zona_id";

        $stmt = $this->_conexion->prepare($consulta);
        $stmt->bindValue(":zona_id", $zonaId, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function obtenerDisponibles()
    {
        $consulta = "SELECT p.*, ST_X(p.ubicacion) as latitud, ST_Y(p.ubicacion) as longitud
                    FROM PlazaAparcamiento p
                    WHERE p.ocupado = 0";

        $stmt = $this->_conexion->prepare($consulta);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function obtenerPorUsuario($usuarioId)
    {
        $consulta = "SELECT p.*, ST_X(p.ubicacion) as latitud, ST_Y(p.ubicacion) as longitud
                    FROM PlazaAparcamiento p
                    WHERE p.usuario_id = :usuario_id";

        $stmt = $this->_conexion->prepare($consulta);
        $stmt->bindValue(":usuario_id", $usuarioId, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function actualizarPlaza($id, $tipo, $tamano, $zonaId, $sourceID, $capaID)
    {
        $consulta = "UPDATE PlazaAparcamiento 
                SET tipo = :tipo, tamano = :tamano, zona_id = :zona_id, sourceID = :sourceID, capaID = :capaID
                WHERE id = :id";

        $stmt = $this->_conexion->prepare($consulta);

        $stmt->bindValue(":id", $id, PDO::PARAM_INT);
        $stmt->bindValue(":tipo", $tipo, PDO::PARAM_STR);
        $stmt->bindValue(":tamano", $tamano, PDO::PARAM_INT);
        $stmt->bindValue(":zona_id", $zonaId, PDO::PARAM_INT);
        $stmt->bindValue(":sourceID", $sourceID, PDO::PARAM_STR);
        $stmt->bindValue(":capaID", $capaID, PDO::PARAM_STR);

        $stmt->execute();

        return $stmt->rowCount();
    }

    public function ocuparPlaza($sourceID, $usuarioID)
    {
        $consulta = "UPDATE PlazaAparcamiento 
                SET ocupado = 1, usuario_id = :usuarioID, hora_reporte = NOW()
                WHERE sourceID = :sourceID";

        $stmt = $this->_conexion->prepare($consulta);

        $stmt->bindValue(":sourceID", $sourceID, PDO::PARAM_STR);
        $stmt->bindValue(":usuarioID", $usuarioID, PDO::PARAM_INT);

        $stmt->execute();

        return $stmt->rowCount();
    }

    public function liberarPlaza($sourceID)
    {
        $consulta = "UPDATE PlazaAparcamiento 
                SET ocupado = 0, usuario_id = NULL, hora_reporte = NOW()
                WHERE sourceID = :sourceID";

        $stmt = $this->_conexion->prepare($consulta);
        $stmt->bindValue(":sourceID", $sourceID, PDO::PARAM_STR);
        $stmt->execute();

        return $stmt->rowCount();
    }

    public function eliminarPlaza($id)
    {
        $consulta = "DELETE FROM PlazaAparcamiento WHERE id = :id";

        $stmt = $this->_conexion->prepare($consulta);
        $stmt->bindValue(":id", $id, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->rowCount();
    }
}
