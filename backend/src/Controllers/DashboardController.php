<?php

namespace App\Controllers;

use App\Repositories\CitaDAO;
use App\Repositories\PacienteDAO;
use App\Repositories\DentistaDAO;
use App\Repositories\PagoDAO;

class DashboardController
{
    public function getStats(): array
    {
        $citaDAO = new CitaDAO();
        $pacienteDAO = new PacienteDAO();
        $dentistaDAO = new DentistaDAO();
        $pagoDAO = new PagoDAO();

        return [
            'citasHoy' => $citaDAO->contarPorFecha(date('Y-m-d')),
            'totalPacientes' => $pacienteDAO->contar(),
            'totalDentistas' => $dentistaDAO->contar(),
            'ingresosEsteMes' => $pagoDAO->totalPorMes(date('Y-m')),
        ];
    }
}
