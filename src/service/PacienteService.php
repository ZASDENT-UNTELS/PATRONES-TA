<?php

require_once __DIR__ . '/../dao/PacienteDAO.php';
require_once __DIR__ . '/../dao/UsuarioDAO.php';
require_once __DIR__ . '/../dao/HistorialMedicoDAO.php';
require_once __DIR__ . '/../dto/PacienteDTO.php';
require_once __DIR__ . '/../database/conexion.php';

class PacienteService
{
    private PacienteDAO $pacienteDAO;
    private UsuarioDAO $usuarioDAO;
    private HistorialMedicoDAO $historialDAO;

    public function __construct()
    {
        $this->pacienteDAO = new PacienteDAO();
        $this->usuarioDAO = new UsuarioDAO();
        $this->historialDAO = new HistorialMedicoDAO();
    }

    /**
     * Obtener el id_paciente a partir de un id_usuario.
     */
    public function obtenerIdPaciente(int $id_usuario): ?int
    {
        $paciente = $this->pacienteDAO->findByIdUsuario($id_usuario);
        return $paciente ? $paciente->id : null;
    }

    /**
     * Obtener el perfil completo del paciente.
     */
    public function obtenerPerfil(int $id_usuario): array
    {
        $perfil = $this->usuarioDAO->getPerfilCompleto($id_usuario);
        if (!$perfil) {
            throw new RuntimeException('Usuario no encontrado.', 404);
        }
        return $perfil;
    }

    /**
     * Actualizar el perfil del paciente.
     */
    public function actualizarPerfil(int $id_usuario, array $datos): array
    {
        $conn = Database::getInstance()->getConnection();
        try {
            $conn->beginTransaction();

            // Actualizar datos básicos de usuario
            $this->usuarioDAO->updatePerfil(
                $id_usuario,
                $datos['nombre_apellido'] ?? '',
                $datos['email']           ?? '',
                $datos['telefono']        ?? null,
                $datos['direccion']       ?? null
            );

            // Verificar si el paciente existe
            $paciente = $this->pacienteDAO->findByIdUsuario($id_usuario);

            $dto = PacienteDTO::fromArray([
                'id_paciente'           => $paciente ? $paciente->id : null,
                'id_usuario'            => $id_usuario,
                'fecha_nacimiento'      => $datos['fecha_nacimiento'] ?? null,
                'genero'                => $datos['genero'] ?? null,
                'alergias'              => $datos['alergias'] ?? null,
                'enfermedades_cronicas' => $datos['enfermedades_cronicas'] ?? null,
                'medicamentos'          => $datos['medicamentos'] ?? null,
                'seguro_medico'         => $datos['seguro_medico'] ?? null,
                'numero_seguro'         => $datos['numero_seguro'] ?? null
            ]);

            if ($paciente) {
                // Actualizar paciente existente
                $this->pacienteDAO->update($dto);
            } else {
                // Crear paciente nuevo
                $this->pacienteDAO->save($dto);
            }

            $conn->commit();
            return ['success' => true, 'message' => 'Perfil actualizado correctamente.'];
        } catch (Exception $e) {
            $conn->rollBack();
            throw new RuntimeException('Error al actualizar el perfil: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Obtener el historial médico del paciente.
     */
    public function obtenerHistorial(int $id_usuario): array
    {
        $id_paciente = $this->obtenerIdPaciente($id_usuario);
        if (!$id_paciente) {
            return []; // No tiene historial
        }

        $historial = $this->historialDAO->findByPaciente($id_paciente);
        
        return array_map(function($h) {
            return [
                'id_historial'        => $h->id,
                'id_paciente'         => $h->idPaciente,
                'id_dentista'         => $h->idDentista,
                'id_tratamiento'      => $h->idTratamiento,
                'fecha_procedimiento' => $h->fechaProcedimiento,
                'diagnostico'         => $h->diagnostico,
                'procedimiento'       => $h->procedimiento,
                'observaciones'       => $h->observaciones,
                'receta'              => $h->receta,
                'proxima_visita'      => $h->proximaVisita,
                'dentista'            => $h->nombreDentista,
                'tratamiento'         => $h->nombreTratamiento
            ];
        }, $historial);
    }

    /**
     * Listar todos los pacientes (para Recepción / Admin).
     */
    public function listarTodos(): array
    {
        $result = $this->pacienteDAO->findAll(1000);
        return array_map(function($p) {
            return [
                'id_paciente'      => $p->id,
                'nombre_apellido'  => $p->nombreApellido,
                'email'            => $p->email,
                'telefono'         => $p->telefono,
                'fecha_nacimiento' => $p->fechaNacimiento,
                'genero'           => $p->genero
            ];
        }, $result['data']);
    }
}
