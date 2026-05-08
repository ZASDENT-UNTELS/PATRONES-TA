<?php

/**
 * Clase Database — Patrón Singleton + Variables de entorno (.env)
 *
 * Paso 1: Singleton       → una sola instancia de conexión
 * Paso 2: dotenv          → credenciales fuera del código fuente
 *
 * Las credenciales ya NO están hardcodeadas aquí.
 * Se leen desde el archivo .env en la raíz del proyecto.
 */

// ── Cargar el autoloader de Composer y la librería dotenv ─────────────────
// Composer genera este archivo al hacer "composer require vlucas/phpdotenv"
// Sube por las carpetas hasta encontrar la raíz del proyecto (donde está .env)

$root = dirname(__DIR__, 2); // desde php/database/ sube 2 niveles → raíz

require_once $root . '/vendor/autoload.php';

// Cargar el .env (solo si no se cargó antes — evita error en peticiones múltiples)
if (!isset($_ENV['DB_HOST'])) {
    $dotenv = Dotenv\Dotenv::createImmutable($root);
    $dotenv->load();

    // Validar que las variables obligatorias existen en el .env
    // Si falta alguna, lanza una excepción clara en vez de un error críptico
    $dotenv->required(['DB_HOST', 'DB_NAME', 'DB_USER'])->notEmpty();
}

// ─────────────────────────────────────────────────────────────────────────────

class Database
{
    // ── Singleton ─────────────────────────────────────────────────────────

    private static ?Database $instance = null;
    private PDO $conn;

    // ── Constructor privado — lee credenciales del .env ───────────────────

    private function __construct()
    {
        $host    = $_ENV['DB_HOST'];
        $db      = $_ENV['DB_NAME'];
        $user    = $_ENV['DB_USER'];
        $pass    = $_ENV['DB_PASS']    ?? '';        // vacío si no se definió
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

    // ── Punto de acceso global ────────────────────────────────────────────

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

    // ── Bloquear clonación y deserialización ──────────────────────────────

    private function __clone() {}

    public function __wakeup(): void
    {
        throw new RuntimeException('No se puede deserializar un Singleton.');
    }
}

// ── Capa de compatibilidad ────────────────────────────────────────────────
// Mantiene funcionando los archivos que usan $db->prepare(...) directamente
$db = Database::getInstance()->getConnection();
