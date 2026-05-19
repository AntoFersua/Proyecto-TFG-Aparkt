<?php
//incluir el archivo conexion
require_once __DIR__ . "/Conexion.php";
require_once __DIR__ . "/Model.php";

//clase usuario que hereda de model
class Usuario extends Model
{
    //FUNCIONES 
    public function obtenerUsuarioPorNombre($usuario)
    {
        $consulta = "SELECT * FROM Usuario WHERE nombre = :nombre";
        $stmt = $this->_conexion->prepare($consulta);
        $stmt->bindValue(":nombre", $usuario, PDO::PARAM_STR);
        $stmt->execute();
        return $stmt->fetch();
    }

    public function obtenerUsuarioPorEmail($email)
    {
        $consulta = "SELECT * FROM Usuario WHERE email = :email";
        $stmt = $this->_conexion->prepare($consulta);
        $stmt->bindValue(":email", $email, PDO::PARAM_STR);
        $stmt->execute();
        return $stmt->fetch();
    }

    public function existeEmail($email)
    {
        $consulta = "SELECT COUNT(*) as total FROM Usuario WHERE email = :email";
        $stmt = $this->_conexion->prepare($consulta);
        $stmt->bindValue(":email", $email, PDO::PARAM_STR);
        $stmt->execute();
        $resultado = $stmt->fetch();
        return $resultado['total'] > 0;
    }

    public function verificarContrasena($contrasena, $hash)
    {
        return password_verify($contrasena, $hash);
    }

    public function obtenerUsuarioPorId($id)
    {
        $consulta = "SELECT * FROM Usuario WHERE id = :id";
        $stmt = $this->_conexion->prepare($consulta);
        $stmt->bindValue(":id", $id, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch();
    }

    public function crearUsuario($nombre, $apellido, $ciudad, $contrasenaHasheada, $email, $telefono)
    {
        $consulta = "INSERT INTO Usuario (nombre, apellido, ciudad, puntuacion, contrasena, email, telefono) VALUES (:nombre, :apellido, :ciudad, :puntuacion, :contrasena, :email, :telefono)";
        $stmt = $this->_conexion->prepare($consulta);
        $stmt->bindValue(":nombre", $nombre, PDO::PARAM_STR);
        $stmt->bindValue(":apellido", $apellido, PDO::PARAM_STR);
        $stmt->bindValue(":ciudad", $ciudad, PDO::PARAM_STR);
        $stmt->bindValue(":telefono", $telefono, PDO::PARAM_STR);
        $stmt->bindValue(":puntuacion", 0, PDO::PARAM_INT);
        $stmt->bindValue(":contrasena", $contrasenaHasheada, PDO::PARAM_STR);
        $stmt->bindValue(":email", $email, PDO::PARAM_STR);
        $stmt->execute();
        return $stmt->rowCount() > 0;
    }

    public function verificarTelefono($telefono)
    {
        // Si la columna telefono no existe, retornar 0
        return 0;

        $consulta = "SELECT COUNT(*) FROM Usuario WHERE telefono = :telefono";
        $stmt = $this->_conexion->prepare($consulta);
        $stmt->bindValue(":telefono", $telefono, PDO::PARAM_STR);
        $stmt->execute();
        return $stmt->fetchColumn();
    }

    public function verificarVehiculoPorEmail($email)
    {
        $consulta = "SELECT COUNT(v.id) as total FROM Usuario u 
                    LEFT JOIN Vehiculo v ON u.id = v.usuario_id 
                    WHERE u.email = :email AND v.id IS NOT NULL";
        $stmt = $this->_conexion->prepare($consulta);
        $stmt->bindValue(":email", $email, PDO::PARAM_STR);
        $stmt->execute();
        $resultado = $stmt->fetch();

        return $resultado['total'] > 0;
    }

    public function obtenerVehiculosPorEmail($email)
    {
        $consulta = "SELECT v.*, p.id as plaza_id, p.tipo as plaza_tipo, p.tamano as plaza_tamano
                    FROM Usuario u 
                    LEFT JOIN Vehiculo v ON u.id = v.usuario_id
                    LEFT JOIN PlazaAparcamiento p ON v.plaza_aparcamiento_id = p.id
                    WHERE u.email = :email";
        $stmt = $this->_conexion->prepare($consulta);
        $stmt->bindValue(":email", $email, PDO::PARAM_STR);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function eliminarUsuario($id)
    {
        // Primero eliminar vehículos asociados
        $consultaVehiculos = "DELETE FROM Vehiculo WHERE usuario_id = :id";
        $stmtVehiculos = $this->_conexion->prepare($consultaVehiculos);
        $stmtVehiculos->bindValue(":id", $id, PDO::PARAM_INT);
        $stmtVehiculos->execute();

        // Luego eliminar el usuario
        $consulta = "DELETE FROM Usuario WHERE id = :id";
        $stmt = $this->_conexion->prepare($consulta);
        $stmt->bindValue(":id", $id, PDO::PARAM_INT);
        return $stmt->execute();
    }

    /**
     * Actualiza el email de un usuario.
     * @param int $id ID del usuario
     * @param string $email Nuevo email
     * @return bool true si se actualizó correctamente
     */
    public function actualizarEmail($id, $email)
    {
        $consulta = "UPDATE usuario SET email = :email WHERE id = :id";
        $stmt = $this->_conexion->prepare($consulta);
        $stmt->bindValue(":id", $id, PDO::PARAM_INT);
        $stmt->bindValue(":email", $email, PDO::PARAM_STR);
        return $stmt->execute();
    }

     /**
     * Actualiza la contraseña de un usuario.
     * @param int $id ID del usuario
     * @param string $password Nueva contraseña
     * @return bool true si se actualizó correctamente
     */
    public function actualizarPassword($id, $password)
    {
        $consulta = "UPDATE usuario SET contrasena = :contrasena WHERE id = :id";

        $stmt = $this->_conexion->prepare($consulta);
        $stmt->bindValue(":id", $id, PDO::PARAM_INT);
        $stmt->bindValue(":contrasena", $password, PDO::PARAM_STR);

        return $stmt->execute();
    }

    
}
