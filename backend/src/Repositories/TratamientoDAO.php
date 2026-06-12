<?php

namespace App\Repositories;

use App\Database\Database;
use PDO;

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
            SELECT id_tratamiento, nombre, descripcion, costo AS precio, duracion_estimada, activo AS estado 
            FROM tratamientos 
            WHERE activo = 1
            ORDER BY nombre ASC
        ');
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getEspecialidades(): array
    {
        $stmt = $this->conn->prepare('
            SELECT id_especialidad, nombre, descripcion, icono 
            FROM especialidades
            ORDER BY nombre ASC
        ');
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
