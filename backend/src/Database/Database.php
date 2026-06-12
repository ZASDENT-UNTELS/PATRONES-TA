<?php

namespace App\Database;

use Dotenv\Dotenv;
use PDO;
use PDOException;
use RuntimeException;
use Exception;

/**
 * Clase Database — Patrón Singleton + Variables de entorno (.env)
 */

class Database
{
    private static ?Database $instance = null;
    private PDO $conn;

    private function __construct()
    {
        // El autoloader ya debería estar cargado en el entry point.
        // Buscamos el .env un nivel arriba de 'src/' (que es 'backend/')
        $root = dirname(__DIR__, 2);

        if (!isset($_ENV['DB_HOST'])) {
            if (file_exists($root . '/.env')) {
                $dotenv = Dotenv::createImmutable($root);
                $dotenv->load();
                $dotenv->required(['DB_HOST', 'DB_NAME', 'DB_USER'])->notEmpty();
            }
        }

        $host    = $_ENV['DB_HOST'] ?? 'localhost';
        $db      = $_ENV['DB_NAME'] ?? 'zazdent';
        $user    = $_ENV['DB_USER'] ?? 'root';
        $pass    = $_ENV['DB_PASS'] ?? '';
        $charset = $_ENV['DB_CHARSET'] ?? 'utf8mb4';

        $dsn = "mysql:host={$host};dbname={$db};charset={$charset}";

        try {
            $this->conn = new PDO($dsn, $user, $pass, [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_PERSISTENT         => false,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ]);
        } catch (PDOException $e) {
            error_log('Error de conexión DB: ' . $e->getMessage());
            throw new RuntimeException('No se pudo conectar a la base de datos.');
        }
    }

    public static function getInstance(): self
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function getConnection(): PDO
    {
        return $this->conn;
    }

    private function __clone() {}

    public function __wakeup(): void
    {
        throw new RuntimeException('No se puede deserializar un Singleton.');
    }
}

// Capa de compatibilidad para código legacy
if (!isset($db)) {
    $db = Database::getInstance()->getConnection();
}
