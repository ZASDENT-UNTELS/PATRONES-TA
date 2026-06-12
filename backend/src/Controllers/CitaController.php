<?php

namespace App\Controllers;

use App\Services\CitaService;
use App\Repositories\CitaDAO;
use App\Repositories\PacienteDAO;
use App\Repositories\DentistaDAO;
use App\Repositories\TratamientoDAO;
use Exception;

/**
 * CitaController — Controlador para la gestión de citas
 */
class CitaController
{
    private CitaService $citaService;
    private CitaDAO $citaDAO;

    public function __construct()
    {
        $this->citaService = new CitaService();
        $this->citaDAO = new CitaDAO();
    }

    /**
     * Listar todas las citas (Filtradas por rol)
     */
    public function listar(): array
    {
        $role = \App\Middleware\AuthMiddleware::getUserRole();
        $userId = \App\Middleware\AuthMiddleware::getUserId();

        if ($role === 4) { // PACIENTE
            $pacienteDAO = new \App\Repositories\PacienteDAO();
            $paciente = $pacienteDAO->findByIdUsuario($userId);
            if ($paciente) {
                return array_map(fn($cita) => $cita->toArray(), $this->citaDAO->findByPaciente($paciente->id));
            }
            return []; // Si no tiene perfil de paciente aún
        }

        if ($role === 2) { // DENTISTA
            $dentistaDAO = new \App\Repositories\DentistaDAO();
            $dentista = $dentistaDAO->findByIdUsuario($userId);
            if ($dentista) {
                return array_map(fn($cita) => $cita->toArray(), $this->citaDAO->findByDentista($dentista['id_dentista']));
            }
            return [];
        }

        // ADMIN (1) o RECEPCION (3) ven todo
        return $this->citaDAO->findAllRaw();
    }

    /**
     * Registrar una nueva cita
     */
    public function registrar(array $datos): array
    {
        return $this->citaService->crear($datos);
    }

    /**
     * Cambiar el estado de una cita
     */
    public function cambiarEstado(int $id, string $estado): array
    {
        return $this->citaService->cambiarEstado($id, $estado);
    }

    /**
     * Eliminar una cita
     */
    public function eliminar(int $id): array
    {
        return $this->citaService->eliminar($id);
    }

    /**
     * Obtener datos para formularios (pacientes, dentistas, tratamientos)
     */
    public function obtenerCatalogos(): array
    {
        $pacienteDAO = new PacienteDAO();
        $dentistaDAO = new DentistaDAO();
        $tratamientoDAO = new TratamientoDAO();

        return [
            'pacientes' => $pacienteDAO->findAll(1000)['data'],
            'dentistas' => $dentistaDAO->findAll(),
            'tratamientos' => $tratamientoDAO->findAll()
        ];
    }
}
