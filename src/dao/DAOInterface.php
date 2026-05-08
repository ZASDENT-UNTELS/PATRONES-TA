<?php

/**
 * DAOInterface — Contrato base que todos los DAOs deben cumplir
 *
 * Define las 4 operaciones CRUD estándar.
 * Cada DAO puede agregar métodos extra (buscar, paginar, etc.)
 * pero estos 4 son obligatorios.
 */
interface DAOInterface
{
    /** Buscar un registro por su ID. Devuelve null si no existe. */
    public function findById(int $id): mixed;

    /** Devolver todos los registros. */
    public function findAll(): array;

    /** Insertar un nuevo registro. Devuelve el ID generado. */
    public function save(mixed $dto): int;

    /** Eliminar un registro por su ID. Devuelve true si se eliminó. */
    public function delete(int $id): bool;
}
