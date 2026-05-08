<?php

require_once __DIR__ . '/../database/conexion.php';

class TratamientoDAO
{
    private PDO $conn;

    public function __construct()
    {
        $this->conn = Database::getInstance()->getConnection();
    }

    /**
     * Obtiene todos los tratamientos activos.
     * Retorna array asociativo para fácil conversión a JSON.
     */
    public function findAll(): array
    {
        $stmt = $this->conn->prepare('
            SELECT id_tratamiento, nombre, descripcion, precio, duracion_estimada, estado 
            FROM tratamientos 
            WHERE estado = "Activo"
            ORDER BY nombre ASC
        ');
        $stmt->execute();
        return $stmt->fetchAll();
    }
}
