<?php

namespace App\Middleware;

use App\Services\AuthService;
use RuntimeException;

class AuthMiddleware
{
    /**
     * Verifica que el usuario esté autenticado.
     * Lanza excepción 401 si no lo está.
     */
    public static function requireAuth(): void
    {
        $authService = new AuthService();
        if (!$authService->estaAutenticado()) {
            throw new RuntimeException('No autenticado.', 401);
        }
    }

    /**
     * Verifica que el usuario tenga alguno de los roles permitidos.
     * Lanza excepción 403 si no tiene permiso.
     */
    public static function requireRole(array $rolesPermitidos): void
    {
        // requireRole implícitamente requiere autenticación
        self::requireAuth();

        $authService = new AuthService();
        $authService->verificarRol($rolesPermitidos);
    }
    
    /**
     * Obtiene el ID del usuario autenticado actualmente
     */
    public static function getUserId(): ?int
    {
        $authService = new AuthService();
        if ($authService->estaAutenticado()) {
            $user = $authService->usuarioActual();
            return $user['id_usuario'] ?? null;
        }
        return null;
    }
    
    /**
     * Obtiene el Rol del usuario autenticado actualmente
     */
    public static function getUserRole(): ?int
    {
        $authService = new AuthService();
        if ($authService->estaAutenticado()) {
            $user = $authService->usuarioActual();
            return $user['id_rol'] ?? null;
        }
        return null;
    }
}
