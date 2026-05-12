<?php

require_once __DIR__ . '/../../models/UsuarioFactory.php';
require_once __DIR__ . '/../../models/UsuarioDAO.php';

/**
 * UsuarioController — Controlador para la gestión de usuarios
 * 
 * Responsabilidades:
 * - Coordinar entre la Vista y el Modelo
 * - Usar UsuarioDAO::listar() para obtener datos
 * - Usar UsuarioFactory para crear instancias
 * - Pasar datos procesados a la vista
 */
class UsuarioController
{
    private UsuarioDAO $usuarioDAO;
    private UsuarioFactory $usuarioFactory;

    public function __construct()
    {
        $this->usuarioDAO = new UsuarioDAO();
        $this->usuarioFactory = new UsuarioFactory();
    }

    /**
     * Acción: Listar todos los usuarios agrupados por rol
     * 
     * Flujo:
     * 1. Obtiene datos de BD con UsuarioDAO::listar()
     * 2. Crea instancias de Usuario con UsuarioFactory::crearMultiples()
     * 3. Agrupa por rol
     * 4. Retorna datos para la vista
     */
    public function listar(): array
    {
        // Paso 1: Obtener datos crudos de la BD
        $datosUsuarios = $this->usuarioDAO->listar();

        // Paso 2: Crear instancias de Usuario usando el factory
        $usuarios = $this->usuarioFactory->crearMultiples($datosUsuarios);

        // Paso 3: Agrupar por rol para presentación
        $usuariosPorRol = [];
        foreach ($usuarios as $usuario) {
            $rol = $usuario->getNombreRol();
            if (!isset($usuariosPorRol[$rol])) {
                $usuariosPorRol[$rol] = [];
            }
            $usuariosPorRol[$rol][] = $usuario;
        }

        // Ordenar roles alfabéticamente
        ksort($usuariosPorRol);

        return [
            'usuarios' => $usuarios,
            'usuarios_por_rol' => $usuariosPorRol,
            'total' => count($usuarios),
        ];
    }

    /**
     * Acción: Obtener un usuario por ID
     */
    public function obtenerPorId(int $idUsuario): ?object
    {
        $datos = $this->usuarioDAO->buscarPorId($idUsuario);
        
        if (!$datos) {
            return null;
        }

        return $this->usuarioFactory->crear($datos);
    }

    /**
     * Acción: Obtener usuarios de un rol específico
     */
    public function obtenerPorRol(int $idRol): array
    {
        $todos = $this->usuarioDAO->listar();
        $filtrados = array_filter($todos, fn($u) => $u['id_rol'] == $idRol);
        
        return $this->usuarioFactory->crearMultiples(array_values($filtrados));
    }

    /**
     * Acción: Registrar un nuevo usuario
     */
    public function registrar(array $datos): array
    {
        $id = $this->usuarioDAO->registrar($datos);
        
        $usuarioData = $this->usuarioDAO->buscarPorId($id);
        $usuario = $this->usuarioFactory->crear($usuarioData);

        return [
            'success' => true,
            'id' => $id,
            'usuario' => $usuario->toArray(),
        ];
    }

    /**
     * Acción: Eliminar un usuario
     */
    public function eliminar(int $idUsuario): bool
    {
        return $this->usuarioDAO->delete($idUsuario);
    }
}
