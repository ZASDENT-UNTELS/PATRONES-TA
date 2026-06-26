<?php

namespace App\Models;


/**
 * Usuario — Clase base abstrata para todos los tipos de usuario
 * 
 * Patrón: Abstract Base Class para Factory Method
 */
abstract class Usuario
{
    protected int $idUsuario;
    protected int $idRol;
    protected string $nombreApellido;
    protected string $usuarioUsuario;
    protected string $email;
    protected ?string $telefono;
    protected bool $activo;
    protected string $nombreRol;
    protected ?string $ultimoLogin;

    public function __construct(array $datos)
    {
        $this->idUsuario = (int) ($datos['id_usuario'] ?? 0);
        $this->idRol = (int) ($datos['id_rol'] ?? 0);
        $this->nombreApellido = (string) ($datos['nombre_apellido'] ?? '');
        $this->usuarioUsuario = (string) ($datos['usuario_usuario'] ?? '');
        $this->email = (string) ($datos['email'] ?? '');
        $this->telefono = $datos['telefono'] ?? null;
        $this->activo = (bool) ($datos['activo'] ?? false);
        $this->nombreRol = (string) ($datos['nombre_rol'] ?? 'Usuario');
        $this->ultimoLogin = $datos['ultimo_login'] ?? null;
    }

    // ── Getters ─────────────────────────────────────────────────────────

    public function getIdUsuario(): int
    {
        return $this->idUsuario;
    }

    public function getIdRol(): int
    {
        return $this->idRol;
    }

    public function getNombreApellido(): string
    {
        return $this->nombreApellido;
    }

    public function getUsuarioUsuario(): string
    {
        return $this->usuarioUsuario;
    }

    public function getEmail(): string
    {
        return $this->email;
    }

    public function getTelefono(): ?string
    {
        return $this->telefono;
    }

    public function isActivo(): bool
    {
        return $this->activo;
    }

    public function getNombreRol(): string
    {
        return $this->nombreRol;
    }

    public function getUltimoLogin(): ?string
    {
        return $this->ultimoLogin;
    }

    // ── Métodos abstractos (cada rol debe implementar) ──────────────────

    /**
     * Retorna el conjunto de permisos del usuario
     */
    abstract public function getPermisos(): array;

    /**
     * Retorna una descripción del rol
     */
    abstract public function getDescripcion(): string;

    /**
     * Retorna un icono o emoji representativo
     */
    abstract public function getIcono(): string;

    /**
     * Verifica si el usuario tiene un permiso específico
     */
    public function tienePermiso(string $permiso): bool
    {
        return in_array($permiso, $this->getPermisos(), true);
    }

    /**
     * Retorna los datos del usuario como array
     */
    public function toArray(): array
    {
        return [
            'id_usuario' => $this->idUsuario,
            'id_rol' => $this->idRol,
            'nombre_apellido' => $this->nombreApellido,
            'usuario_usuario' => $this->usuarioUsuario,
            'email' => $this->email,
            'telefono' => $this->telefono,
            'activo' => $this->activo,
            'nombre_rol' => $this->nombreRol,
            'ultimo_login' => $this->ultimoLogin,
        ];
    }

    /**
     * Retorna JSON seguro del usuario
     */
    public function toJson(): string
    {
        return json_encode($this->toArray(), JSON_UNESCAPED_UNICODE);
    }
}
