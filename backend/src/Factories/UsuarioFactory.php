<?php

namespace App\Factories;

use App\Models\Administrador;
use App\Models\Dentista;
use App\Models\Paciente;
use App\Models\Recepcionista;
use App\Models\Usuario;
use Exception;
use InvalidArgumentException;




/**
 * UsuarioFactory — Factory Method para crear instancias de Usuario
 * 
 * Patrón de Diseño: Factory Method
 * 
 * Responsabilidad: Encapsular la lógica de creación de objetos Usuario
 * según el rol asignado. Permite agregar nuevos tipos de usuario sin
 * modificar el código que los utiliza.
 */
class UsuarioFactory
{
    // Mapeo de rol ID a clase
    private const ROLE_MAP = [
        1 => Administrador::class,
        2 => Dentista::class,
        3 => Recepcionista::class,
        4 => Paciente::class,
    ];

    /**
     * Factory Method: Crea una instancia de Usuario según el rol
     * 
     * @param array $datos Array con datos del usuario (debe incluir id_rol)
     * @return Usuario Instancia de la clase de usuario correspondiente
     * 
     * @throws InvalidArgumentException Si el rol no es válido
     */
    public static function crear(array $datos): Usuario
    {
        $idRol = (int) ($datos['id_rol'] ?? 0);

        if (!isset(self::ROLE_MAP[$idRol])) {
            throw new InvalidArgumentException(
                "Rol de usuario inválido: {$idRol}. Roles válidos: " . implode(', ', array_keys(self::ROLE_MAP))
            );
        }

        $clase = self::ROLE_MAP[$idRol];
        return new $clase($datos);
    }

    /**
     * Crea múltiples instancias de Usuario a partir de un array de datos
     * 
     * @param array $usuarios Array de arrays con datos de usuarios
     * @return Usuario[] Array de instancias de Usuario
     */
    public static function crearMultiples(array $usuarios): array
    {
        return array_map(fn($datos) => self::crear($datos), $usuarios);
    }

    /**
     * Retorna el mapeo de roles disponibles
     * 
     * @return array Mapeo de [id_rol => nombreClase]
     */
    public static function getRolesDisponibles(): array
    {
        return self::ROLE_MAP;
    }

    /**
     * Verifica si un rol es válido
     * 
     * @param int $idRol ID del rol a verificar
     * @return bool True si el rol existe, false en caso contrario
     */
    public static function isRolValido(int $idRol): bool
    {
        return isset(self::ROLE_MAP[$idRol]);
    }

    /**
     * Retorna el nombre de la clase para un rol específico
     * 
     * @param int $idRol ID del rol
     * @return string|null Nombre de la clase o null si no existe
     */
    public static function getClaseParaRol(int $idRol): ?string
    {
        return self::ROLE_MAP[$idRol] ?? null;
    }
}
