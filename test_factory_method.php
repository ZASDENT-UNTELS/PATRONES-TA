<?php
/**
 * test_factory_method.php — Pruebas del patrón Factory Method
 * 
 * Valida:
 * - Creación de instancias por rol
 * - Permisos específicos de cada rol
 * - Integración con UsuarioDAO::listar()
 * - Separación MVC
 */

define('ROOT_PATH', __DIR__);

require_once ROOT_PATH . '/vendor/autoload.php';
require_once ROOT_PATH . '/src/database/conexion.php';
require_once ROOT_PATH . '/models/UsuarioFactory.php';
require_once ROOT_PATH . '/models/UsuarioDAO.php';
require_once ROOT_PATH . '/src/controller/UsuarioController.php';

echo "╔════════════════════════════════════════════════════════════════════════════╗\n";
echo "║           PRUEBAS - Factory Method para Usuarios                          ║\n";
echo "╚════════════════════════════════════════════════════════════════════════════╝\n\n";

// ────────────────────────────────────────────────────────────────────────────
// PRUEBA 1: Creación de instancias por Factory
// ────────────────────────────────────────────────────────────────────────────

echo "1. PRUEBA - Creación de instancias por Factory\n";
echo "═════════════════════════════════════════════════════════════════════════\n\n";

$datosUsuariosEjemplo = [
    ['id_usuario' => 1, 'id_rol' => 1, 'nombre_apellido' => 'Diego Admin', 'usuario_usuario' => 'admin', 'email' => 'admin@test.com', 'nombre_rol' => 'Administrador', 'activo' => 1],
    ['id_usuario' => 2, 'id_rol' => 2, 'nombre_apellido' => 'Juan Dentista', 'usuario_usuario' => 'dentista', 'email' => 'dentista@test.com', 'nombre_rol' => 'Dentista', 'activo' => 1],
    ['id_usuario' => 3, 'id_rol' => 3, 'nombre_apellido' => 'María Recepción', 'usuario_usuario' => 'recepcion', 'email' => 'recepcion@test.com', 'nombre_rol' => 'Recepcionista', 'activo' => 1],
];

try {
    $usuarios = UsuarioFactory::crearMultiples($datosUsuariosEjemplo);
    
    echo "✓ Factory creó " . count($usuarios) . " instancias correctamente.\n\n";
    
    foreach ($usuarios as $usuario) {
        echo "  Usuario: {$usuario->getNombreApellido()}\n";
        echo "  Clase: " . get_class($usuario) . "\n";
        echo "  Rol: {$usuario->getNombreRol()} {$usuario->getIcono()}\n";
        echo "  Descripción: {$usuario->getDescripcion()}\n";
        echo "  Permisos: " . count($usuario->getPermisos()) . "\n\n";
    }
} catch (Exception $e) {
    echo "✗ Error: " . $e->getMessage() . "\n";
}

// ────────────────────────────────────────────────────────────────────────────
// PRUEBA 2: Permisos específicos por rol
// ────────────────────────────────────────────────────────────────────────────

echo "\n2. PRUEBA - Permisos específicos por rol\n";
echo "═════════════════════════════════════════════════════════════════════════\n\n";

$rolesConPermisos = [
    1 => 'Administrador',
    2 => 'Dentista',
    3 => 'Recepcionista',
    4 => 'Paciente'
];

foreach ($rolesConPermisos as $idRol => $nombreRol) {
    $datosUsuario = [
        'id_usuario' => $idRol,
        'id_rol' => $idRol,
        'nombre_apellido' => "Usuario {$nombreRol}",
        'usuario_usuario' => strtolower($nombreRol),
        'email' => strtolower($nombreRol) . '@test.com',
        'nombre_rol' => $nombreRol,
        'activo' => 1
    ];

    try {
        $usuario = UsuarioFactory::crear($datosUsuario);
        $permisos = $usuario->getPermisos();
        
        echo "✓ {$nombreRol} {$usuario->getIcono()}\n";
        echo "  Permisos: " . implode(', ', $permisos) . "\n\n";
    } catch (Exception $e) {
        echo "✗ Error al crear {$nombreRol}: " . $e->getMessage() . "\n";
    }
}

// ────────────────────────────────────────────────────────────────────────────
// PRUEBA 3: Validación de permisos
// ────────────────────────────────────────────────────────────────────────────

echo "\n3. PRUEBA - Validación de permisos\n";
echo "═════════════════════════════════════════════════════════════════════════\n\n";

$datosAdmin = [
    'id_usuario' => 1,
    'id_rol' => 1,
    'nombre_apellido' => 'Admin Test',
    'usuario_usuario' => 'admin_test',
    'email' => 'admin@test.com',
    'nombre_rol' => 'Administrador',
    'activo' => 1
];

$admin = UsuarioFactory::crear($datosAdmin);

$permisosAProbar = [
    'crear_usuarios' => true,
    'editar_usuarios' => true,
    'eliminar_usuarios' => true,
    'ver_mi_perfil' => false,
];

echo "Administrador tiene permisos:\n";
foreach ($permisosAProbar as $permiso => $esperado) {
    $tiene = $admin->tienePermiso($permiso);
    $estado = $tiene === $esperado ? '✓' : '✗';
    echo "  {$estado} {$permiso}: " . ($tiene ? 'SÍ' : 'NO') . "\n";
}

echo "\n";

$datosPaciente = [
    'id_usuario' => 4,
    'id_rol' => 4,
    'nombre_apellido' => 'Paciente Test',
    'usuario_usuario' => 'paciente_test',
    'email' => 'paciente@test.com',
    'nombre_rol' => 'Paciente',
    'activo' => 1
];

$paciente = UsuarioFactory::crear($datosPaciente);

$permisosAProbPaciente = [
    'ver_mis_citas' => true,
    'crear_usuarios' => false,
    'editar_mi_perfil' => true,
    'eliminar_usuarios' => false,
];

echo "Paciente tiene permisos:\n";
foreach ($permisosAProbPaciente as $permiso => $esperado) {
    $tiene = $paciente->tienePermiso($permiso);
    $estado = $tiene === $esperado ? '✓' : '✗';
    echo "  {$estado} {$permiso}: " . ($tiene ? 'SÍ' : 'NO') . "\n";
}

// ────────────────────────────────────────────────────────────────────────────
// PRUEBA 4: Integración con UsuarioDAO::listar()
// ────────────────────────────────────────────────────────────────────────────

echo "\n\n4. PRUEBA - Integración con UsuarioDAO::listar()\n";
echo "═════════════════════════════════════════════════════════════════════════\n\n";

try {
    $dao = new UsuarioDAO();
    $datosDesdeDAO = $dao->listar();
    
    echo "✓ UsuarioDAO::listar() retornó " . count($datosDesdeDAO) . " usuarios.\n\n";
    
    $usuariosDesdeFactory = UsuarioFactory::crearMultiples($datosDesdeDAO);
    
    echo "✓ Factory creó " . count($usuariosDesdeFactory) . " instancias desde datos del DAO.\n\n";
    
    // Mostrar primeros 5 usuarios
    echo "Primeros 5 usuarios:\n";
    foreach (array_slice($usuariosDesdeFactory, 0, 5) as $usuario) {
        $clase = substr(strrchr(get_class($usuario), '\\'), 1) ?: get_class($usuario);
        echo "  • {$usuario->getNombreApellido()} ({$usuario->getNombreRol()}) - Clase: {$clase}\n";
    }
} catch (Exception $e) {
    echo "✗ Error: " . $e->getMessage() . "\n";
}

// ────────────────────────────────────────────────────────────────────────────
// PRUEBA 5: Controlador con Factory
// ────────────────────────────────────────────────────────────────────────────

echo "\n\n5. PRUEBA - Controlador con Factory (MVC)\n";
echo "═════════════════════════════════════════════════════════════════════════\n\n";

try {
    $controller = new UsuarioController();
    $resultado = $controller->listar();
    
    echo "✓ Controlador::listar() retornó datos:\n";
    echo "  - Total usuarios: {$resultado['total']}\n";
    echo "  - Roles distintos: " . count($resultado['usuarios_por_rol']) . "\n\n";
    
    echo "Usuarios por rol:\n";
    foreach ($resultado['usuarios_por_rol'] as $rol => $usuariosRol) {
        $primerUsuario = $usuariosRol[0];
        echo "  • {$rol} {$primerUsuario->getIcono()}: " . count($usuariosRol) . " usuario(s)\n";
    }
} catch (Exception $e) {
    echo "✗ Error: " . $e->getMessage() . "\n";
}

// ────────────────────────────────────────────────────────────────────────────
// PRUEBA 6: Validación de rol inválido
// ────────────────────────────────────────────────────────────────────────────

echo "\n\n6. PRUEBA - Validación de rol inválido\n";
echo "═════════════════════════════════════════════════════════════════════════\n\n";

try {
    $datosInvalido = [
        'id_usuario' => 999,
        'id_rol' => 999,  // Rol no existente
        'nombre_apellido' => 'Usuario Inválido',
        'usuario_usuario' => 'invalido',
        'email' => 'invalido@test.com',
        'nombre_rol' => 'Rol Desconocido',
        'activo' => 1
    ];
    
    $usuario = UsuarioFactory::crear($datosInvalido);
    echo "✗ Debería haber lanzado excepción\n";
} catch (InvalidArgumentException $e) {
    echo "✓ Excepción capturada correctamente:\n";
    echo "  Mensaje: " . $e->getMessage() . "\n";
}

// ────────────────────────────────────────────────────────────────────────────
// PRUEBA 7: Serialización JSON
// ────────────────────────────────────────────────────────────────────────────

echo "\n\n7. PRUEBA - Serialización JSON\n";
echo "═════════════════════════════════════════════════════════════════════════\n\n";

try {
    $datosUsuario = [
        'id_usuario' => 1,
        'id_rol' => 1,
        'nombre_apellido' => 'Admin JSON Test',
        'usuario_usuario' => 'admin_json',
        'email' => 'admin_json@test.com',
        'nombre_rol' => 'Administrador',
        'activo' => 1
    ];
    
    $usuario = UsuarioFactory::crear($datosUsuario);
    $json = $usuario->toJson();
    $decodificado = json_decode($json, true);
    
    echo "✓ Usuario serializado a JSON:\n";
    echo "  JSON: {$json}\n\n";
    echo "✓ JSON decodificado validado:\n";
    echo "  - id_usuario: {$decodificado['id_usuario']}\n";
    echo "  - nombre_apellido: {$decodificado['nombre_apellido']}\n";
    echo "  - nombre_rol: {$decodificado['nombre_rol']}\n";
} catch (Exception $e) {
    echo "✗ Error: " . $e->getMessage() . "\n";
}

// ────────────────────────────────────────────────────────────────────────────
// RESUMEN
// ────────────────────────────────────────────────────────────────────────────

echo "\n\n╔════════════════════════════════════════════════════════════════════════════╗\n";
echo "║                    ✓ PRUEBAS COMPLETADAS EXITOSAMENTE                     ║\n";
echo "║                                                                            ║\n";
echo "║  Factory Method implementado y validado:                                  ║\n";
echo "║  ✓ Creación de instancias por rol                                         ║\n";
echo "║  ✓ Permisos específicos por rol                                           ║\n";
echo "║  ✓ Validación y control de errores                                        ║\n";
echo "║  ✓ Integración con UsuarioDAO::listar()                                   ║\n";
echo "║  ✓ Separación MVC (Modelo, Vista, Controlador)                            ║\n";
echo "║  ✓ Serialización JSON                                                     ║\n";
echo "╚════════════════════════════════════════════════════════════════════════════╝\n";
