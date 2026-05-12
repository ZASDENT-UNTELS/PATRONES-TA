<!-- views/usuarios_list.php — Vista para listar usuarios con sus roles específicos -->

<?php
/**
 * Vista: Lista de Usuarios con Factory Method
 * 
 * Responsabilidades:
 * - Mostrar los usuarios con sus características específicas del rol
 * - Presentar permisos y descripción de cada rol
 * - Interfaz visual clara y separada por rol
 */

// Datos pasados por el controlador
// $usuarios (array de Usuario objects)
// $usuarios_por_rol (array agrupado por rol)
?>

<div class="usuarios-container">
    <h2>Gestión de Usuarios por Rol</h2>
    
    <!-- Información general -->
    <div class="info-box">
        <p>Total de usuarios: <strong><?php echo count($usuarios); ?></strong></p>
        <p>Roles activos: <strong><?php echo count($usuarios_por_rol); ?></strong></p>
    </div>

    <!-- Tablas por rol -->
    <?php foreach ($usuarios_por_rol as $rol => $usuariosPorRol): ?>
        <div class="rol-section">
            <div class="rol-header">
                <h3><?php echo $usuariosPorRol[0]->getIcono(); ?> <?php echo $rol; ?></h3>
                <p class="rol-description"><?php echo $usuariosPorRol[0]->getDescripcion(); ?></p>
            </div>

            <table class="usuarios-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Usuario</th>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Teléfono</th>
                        <th>Estado</th>
                        <th>Último Login</th>
                        <th>Permisos</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($usuariosPorRol as $usuario): ?>
                        <tr>
                            <td><?php echo $usuario->getIdUsuario(); ?></td>
                            <td><code><?php echo htmlspecialchars($usuario->getUsuarioUsuario()); ?></code></td>
                            <td><?php echo htmlspecialchars($usuario->getNombreApellido()); ?></td>
                            <td><?php echo htmlspecialchars($usuario->getEmail()); ?></td>
                            <td><?php echo htmlspecialchars($usuario->getTelefono() ?? 'N/A'); ?></td>
                            <td>
                                <span class="estado <?php echo $usuario->isActivo() ? 'activo' : 'inactivo'; ?>">
                                    <?php echo $usuario->isActivo() ? 'Activo' : 'Inactivo'; ?>
                                </span>
                            </td>
                            <td><?php echo htmlspecialchars($usuario->getUltimoLogin() ?? 'Nunca'); ?></td>
                            <td>
                                <button class="btn-permisos" onclick="mostrarPermisos(<?php echo $usuario->getIdUsuario(); ?>)">
                                    Ver (<?php echo count($usuario->getPermisos()); ?>)
                                </button>
                            </td>
                            <td>
                                <div class="btn-group">
                                    <button class="btn-edit" onclick="editarUsuario(<?php echo $usuario->getIdUsuario(); ?>)">Editar</button>
                                    <button class="btn-delete" onclick="eliminarUsuario(<?php echo $usuario->getIdUsuario(); ?>)">Eliminar</button>
                                </div>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    <?php endforeach; ?>
</div>

<!-- Modal de Permisos -->
<div id="permisosModal" class="modal">
    <div class="modal-content">
        <span class="close" onclick="cerrarModal('permisosModal')">&times;</span>
        <h3>Permisos del Usuario</h3>
        <div id="permisosLista"></div>
    </div>
</div>

<style>
.usuarios-container {
    padding: 20px;
    background-color: #f5f5f5;
    border-radius: 8px;
}

.info-box {
    background: #e3f2fd;
    padding: 15px;
    border-radius: 4px;
    margin-bottom: 20px;
    border-left: 4px solid #2196f3;
}

.rol-section {
    margin-bottom: 30px;
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.rol-header {
    border-bottom: 2px solid #f0f0f0;
    padding-bottom: 15px;
    margin-bottom: 15px;
}

.rol-header h3 {
    margin: 0;
    font-size: 1.5em;
    color: #333;
}

.rol-description {
    margin: 8px 0 0 0;
    color: #666;
    font-size: 0.9em;
    font-style: italic;
}

.usuarios-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.9em;
}

.usuarios-table th {
    background-color: #f9f9f9;
    padding: 12px;
    text-align: left;
    border-bottom: 2px solid #ddd;
    font-weight: 600;
    color: #555;
}

.usuarios-table td {
    padding: 12px;
    border-bottom: 1px solid #eee;
}

.usuarios-table tr:hover {
    background-color: #f9f9f9;
}

.estado {
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.85em;
    font-weight: 600;
}

.estado.activo {
    background-color: #c8e6c9;
    color: #2e7d32;
}

.estado.inactivo {
    background-color: #ffcdd2;
    color: #c62828;
}

.btn-permisos {
    background-color: #2196f3;
    color: white;
    padding: 6px 12px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.85em;
}

.btn-permisos:hover {
    background-color: #1976d2;
}

.btn-group {
    display: flex;
    gap: 5px;
}

.btn-edit, .btn-delete {
    padding: 6px 10px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.85em;
}

.btn-edit {
    background-color: #ff9800;
    color: white;
}

.btn-edit:hover {
    background-color: #f57c00;
}

.btn-delete {
    background-color: #f44336;
    color: white;
}

.btn-delete:hover {
    background-color: #da190b;
}

.modal {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
}

.modal-content {
    background-color: white;
    margin: 5% auto;
    padding: 20px;
    border-radius: 8px;
    width: 90%;
    max-width: 600px;
    max-height: 70vh;
    overflow-y: auto;
}

.close {
    float: right;
    font-size: 28px;
    font-weight: bold;
    cursor: pointer;
    color: #999;
}

.close:hover {
    color: #333;
}

code {
    background-color: #f5f5f5;
    padding: 2px 6px;
    border-radius: 3px;
    font-family: 'Courier New', monospace;
    font-size: 0.9em;
}
</style>

<script>
function mostrarPermisos(usuarioId) {
    // En una aplicación real, esto traería los permisos del servidor
    const modal = document.getElementById('permisosModal');
    const lista = document.getElementById('permisosLista');
    
    // Placeholder: mostrar un mensaje
    lista.innerHTML = `<p>Cargando permisos del usuario ${usuarioId}...</p>`;
    modal.style.display = 'block';
}

function cerrarModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function editarUsuario(usuarioId) {
    alert(`Editar usuario: ${usuarioId}`);
}

function eliminarUsuario(usuarioId) {
    if (confirm(`¿Está seguro de que desea eliminar el usuario ${usuarioId}?`)) {
        alert(`Usuario ${usuarioId} eliminado.`);
    }
}

// Cerrar modal al hacer clic fuera
window.onclick = function(event) {
    const modal = document.getElementById('permisosModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}
</script>
