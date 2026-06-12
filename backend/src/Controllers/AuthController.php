<?php

namespace App\Controllers;

use App\Services\AuthService;

class AuthController
{
    private AuthService $authService;

    public function __construct()
    {
        $this->authService = new AuthService();
    }

    public function login(array $data): array
    {
        if (empty($data['username']) || empty($data['password'])) {
            throw new \InvalidArgumentException('Usuario y contraseña requeridos', 400);
        }

        $result = $this->authService->login($data['username'], $data['password']);

        if (!$result) {
            throw new \RuntimeException('Credenciales inválidas', 401);
        }

        return $result;
    }

    public function me(): array
    {
        $user = $this->authService->usuarioActual();
        if (!$user) {
            throw new \RuntimeException('No autorizado', 401);
        }
        return $user;
    }

    public function logout(): array
    {
        $this->authService->logout();
        return ['message' => 'Sesión cerrada'];
    }
}
