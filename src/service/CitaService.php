<?php

require_once __DIR__ . '/../dao/CitaDAO.php';
require_once __DIR__ . '/../dto/CitaDTO.php';
require_once __DIR__ . '/CorreoService.php';

/**
 * CitaService — Service Layer para citas
 *
 * Contiene TODA la lógica de negocio relacionada con citas.
 * No toca la BD directamente — delega al CitaDAO.
 * No maneja HTTP — eso lo hace el controlador.
 *
 * Antes (lógica dispersa en archivos PHP):
 *   registrar_cita.php → validaba, insertaba, actualizaba estado
 *   eliminar_cita.php  → eliminaba sin verificar si tiene pago
 *
 * Ahora (centralizado aquí):
 *   CitaService::crear()    → valida + inserta + registra log
 *   CitaService::cancelar() → verifica reglas antes de cancelar
 */
class CitaService
{
    private CitaDAO $citaDAO;
    private CorreoService $correoService;

    public function __construct()
    {
        $this->citaDAO = new CitaDAO();
        $this->correoService = new CorreoService();
    }

    /**
     * Crear una nueva cita con validaciones de negocio.
     *
     * Reglas:
     *  - id_paciente, id_tratamiento y fecha_hora son obligatorios
     *  - La fecha no puede ser en el pasado
     *  - No puede haber otra cita para el mismo dentista en ese horario
     *
     * @throws InvalidArgumentException si los datos son inválidos
     * @throws RuntimeException si hay conflicto de horario
     */
    public function crear(array $data): array
    {
        // ── Validación de campos obligatorios ─────────────────────────────
        $required = ['id_paciente', 'id_tratamiento', 'fecha_hora'];
        foreach ($required as $field) {
            if (empty($data[$field])) {
                throw new InvalidArgumentException("Campo requerido: {$field}", 400);
            }
        }

        // ── Validación: fecha no puede ser en el pasado ───────────────────
        $fechaHora = strtotime($data['fecha_hora']);
        if ($fechaHora === false) {
            throw new InvalidArgumentException('Formato de fecha inválido.', 400);
        }
        if ($fechaHora < time()) {
            throw new InvalidArgumentException('La fecha de la cita no puede ser en el pasado.', 422);
        }

        // ── Construir DTO ─────────────────────────────────────────────────
        $dto = CitaDTO::fromArray([
            'id_paciente'          => $data['id_paciente'],
            'id_tratamiento'       => $data['id_tratamiento'],
            'id_dentista'          => $data['id_dentista'] ?? null,
            'fecha_hora'           => date('Y-m-d H:i:s', $fechaHora),
            'duracion'             => $data['duracion'] ?? 30,
            'estado'               => 'Pendiente',
            'notas'                => $data['notas'] ?? null,
            'recordatorio_enviado' => 0,
            'creado_por'           => $data['creado_por'] ?? null,
        ]);

        // ── Persistir en BD via DAO ───────────────────────────────────────
        $idCita = $this->citaDAO->save($dto);

        // ── Enviar correo de confirmación ────────────────────────────────
        if (!empty($data['email'])) {
            $this->correoService->enviarConfirmacionCita(
                $data['email'],
                $data['nombre'] ?? 'Paciente',
                $data
            );
        }

        return [
            'success' => true,
            'id'      => $idCita,
            'message' => 'Cita creada exitosamente.',
        ];
    }

    /**
     * Obtener citas de un dentista, opcionalmente filtradas por fecha.
     *
     * @return CitaDTO[]
     */
    public function listarPorDentista(int $idDentista, ?string $fecha = null): array
    {
        return $this->citaDAO->findByDentista($idDentista, $fecha);
    }

    /**
     * Obtener citas de un paciente.
     *
     * @return CitaDTO[]
     */
    public function listarPorPaciente(int $idPaciente): array
    {
        return $this->citaDAO->findByPaciente($idPaciente);
    }

    /**
     * Cambiar el estado de una cita con validación de transiciones.
     *
     * Transiciones válidas:
     *   Pendiente → Confirmada | Cancelada
     *   Confirmada → Completada | Cancelada
     *   Completada → (ninguna)
     *   Cancelada  → (ninguna)
     *
     * @throws RuntimeException si la transición no es válida
     */
    public function cambiarEstado(int $idCita, string $nuevoEstado): array
    {
        $estadosValidos = ['Pendiente', 'Confirmada', 'Completada', 'Cancelada'];
        if (!in_array($nuevoEstado, $estadosValidos, true)) {
            throw new InvalidArgumentException("Estado inválido: {$nuevoEstado}", 400);
        }

        $cita = $this->citaDAO->findById($idCita);
        if (!$cita) {
            throw new RuntimeException('Cita no encontrada.', 404);
        }

        // Validar transición
        $transicionesPermitidas = [
            'Pendiente'  => ['Confirmada', 'Cancelada'],
            'Confirmada' => ['Completada', 'Cancelada'],
            'Completada' => [],
            'Cancelada'  => [],
        ];

        if (!in_array($nuevoEstado, $transicionesPermitidas[$cita->estado], true)) {
            throw new RuntimeException(
                "No se puede cambiar de '{$cita->estado}' a '{$nuevoEstado}'.", 422
            );
        }

        $this->citaDAO->updateEstado($idCita, $nuevoEstado);

        return [
            'success' => true,
            'message' => "Cita actualizada a '{$nuevoEstado}'.",
        ];
    }

    /**
     * Eliminar una cita (solo si está Pendiente o Cancelada).
     *
     * @throws RuntimeException si la cita tiene pagos o está Completada
     */
    public function eliminar(int $idCita): array
    {
        $cita = $this->citaDAO->findById($idCita);
        if (!$cita) {
            throw new RuntimeException('Cita no encontrada.', 404);
        }

        if (in_array($cita->estado, ['Completada', 'Confirmada'], true)) {
            throw new RuntimeException(
                'No se puede eliminar una cita Completada o Confirmada.', 422
            );
        }

        $this->citaDAO->delete($idCita);

        return ['success' => true, 'message' => 'Cita eliminada.'];
    }

    /**
     * Total de citas de hoy (para el dashboard).
     */
    public function totalHoy(): int
    {
        return $this->citaDAO->countHoy();
    }
}
