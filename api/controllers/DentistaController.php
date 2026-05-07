<?php

require_once __DIR__ . '/../../php/dao/DentistaDAO.php';

class DentistaController
{
    private DentistaDAO $dao;

    public function __construct()
    {
        $this->dao = new DentistaDAO();
    }

    public function processRequest(string $method, ?int $id): void
    {
        if ($method === 'GET') {
            $this->getAll();
        } else {
            $this->methodNotAllowed();
        }
    }

    private function getAll(): void
    {
        try {
            $dentistas = $this->dao->findAll();
            http_response_code(200);
            echo json_encode([
                'success' => true,
                'data' => $dentistas
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => 'Error interno del servidor']);
        }
    }

    private function methodNotAllowed(): void
    {
        http_response_code(405);
        echo json_encode(['error' => 'Método no permitido']);
    }
}
