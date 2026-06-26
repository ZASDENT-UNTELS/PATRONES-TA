<?php

namespace App\Repositories;

use App\Database\Database;
use PDO;




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
            WHERE u.activo = 1
            ORDER BY u.nombre_apellido ASC
        ');
        $stmt->execute();
        return $stmt->fetchAll();
    }

    /**
     * Contar total de dentistas activos.
     */
    public function contar(): int
    {
        $stmt = $this->conn->query("SELECT COUNT(*) FROM dentistas");
        return (int) $stmt->fetchColumn();
    }

    /**
     * Buscar dentista por id_usuario
     */
    public function findByIdUsuario(int $idUsuario): ?array
    {
        $stmt = $this->conn->prepare('
            SELECT d.*, u.nombre_apellido
            FROM dentistas d
            JOIN usuarios u ON d.id_usuario = u.id_usuario
            WHERE d.id_usuario = :id_usuario
            LIMIT 1
        ');
        $stmt->execute([':id_usuario' => $idUsuario]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row ?: null;
    }
}
