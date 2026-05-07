<?php

require_once __DIR__ . '/../database/conexion.php';

class DentistaDAO
{
    private PDO $conn;

    public function __construct()
    {
        $this->conn = Database::getInstance()->getConnection();
    }

    /**
     * Obtiene todos los dentistas activos con su usuario y especialidad.
     */
    public function findAll(): array
    {
        $stmt = $this->conn->prepare('
            SELECT 
                d.id_dentista,
                u.nombre_apellido AS nombre,
                e.nombre AS especialidad,
                d.biografia,
                d.experiencia,
                d.foto
            FROM dentistas d
            JOIN usuarios u ON d.id_usuario = u.id_usuario
            LEFT JOIN especialidades e ON d.id_especialidad = e.id_especialidad
            WHERE u.estado = "Activo"
            ORDER BY u.nombre_apellido ASC
        ');
        $stmt->execute();
        return $stmt->fetchAll();
    }
}
