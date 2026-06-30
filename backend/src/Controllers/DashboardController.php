<?php

namespace App\Controllers;

use App\Repositories\CitaDAO;
use App\Repositories\PacienteDAO;
use App\Repositories\DentistaDAO;
use App\Repositories\PagoDAO;

class DashboardController
{
    private ?CitaDAO $citaDAO = null;
    private ?PacienteDAO $pacienteDAO = null;
    private ?DentistaDAO $dentistaDAO = null;
    private ?PagoDAO $pagoDAO = null;

    public function getStats(): array
    {
        return [
            'citasHoy' => $this->getCitaDAO()->contarPorFecha(date('Y-m-d')),
            'totalPacientes' => $this->getPacienteDAO()->contar(),
            'totalDentistas' => $this->getDentistaDAO()->contar(),
            'ingresosEsteMes' => $this->getPagoDAO()->totalPorMes(date('Y-m')),
        ];
    }

    private function getCitaDAO(): CitaDAO
    {
        if ($this->citaDAO === null) {
            $this->citaDAO = new CitaDAO();
        }

        return $this->citaDAO;
    }

    private function getPacienteDAO(): PacienteDAO
    {
        if ($this->pacienteDAO === null) {
            $this->pacienteDAO = new PacienteDAO();
        }

        return $this->pacienteDAO;
    }

    private function getDentistaDAO(): DentistaDAO
    {
        if ($this->dentistaDAO === null) {
            $this->dentistaDAO = new DentistaDAO();
        }

        return $this->dentistaDAO;
    }

    private function getPagoDAO(): PagoDAO
    {
        if ($this->pagoDAO === null) {
            $this->pagoDAO = new PagoDAO();
        }

        return $this->pagoDAO;
    }
}
