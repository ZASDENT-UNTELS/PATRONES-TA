// Configuración inicial de DataTables
$(document).ready(function() {
    const tablaPagos = $('#tablaPagos').DataTable({
        ajax: {
            url: 'buscar_pago.php',
            dataSrc: 'data'
        },
        columns: [
            { data: 'id_pago' },
            { data: 'paciente' },
            { data: 'tratamiento' },
            { data: 'monto_formateado' },
            { data: 'metodo_pago' },
            { 
                data: 'estado_visual',
                render: function(data, type, row) {
                    let badgeClass = '';
                    switch(row.estado) {
                        case 'Completado': badgeClass = 'bg-success'; break;
                        case 'Pendiente': badgeClass = 'bg-warning text-dark'; break;
                        case 'Reembolsado': badgeClass = 'bg-info text-dark'; break;
                        case 'Cancelado': badgeClass = 'bg-danger'; break;
                        default: badgeClass = 'bg-secondary';
                    }
                    return `<span class="badge ${badgeClass}">${data}</span>`;
                }
            },
            { data: 'fecha_pago_formateada' },
            {
                data: 'id_pago',
                render: function(data, type, row) {
                    return `
                        <div class="btn-group" role="group">
                            <a href="editar_pago/pago_editar.html?id=${data}" class="btn btn-sm btn-primary">✏️ Editar</a>
                            <button onclick="confirmarEliminar(${data})" class="btn btn-sm btn-danger">🗑️ Eliminar</button>
                        </div>
                    `;
                },
                orderable: false
            }
        ],
        language: {
            url: 'https://cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json'
        }
    });

   

    // Configurar formulario de edición
    if (window.location.pathname.includes('editar_pago/pago_editar.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const idPago = urlParams.get('id');
        
        if (idPago) {
            cargarDatosPago(idPago);
            
            $('#formEditarPago').on('submit', function(e) {
                e.preventDefault();
                actualizarPago(idPago);
            });
        } else {
            alert('No se proporcionó ID de pago');
            window.location.href = 'pago.html';
        }
    }
});


// Función para eliminar pagos
function confirmarEliminar(idPago) {
    if (confirm('¿Está seguro que desea eliminar este pago? Esta acción no se puede deshoder.')) {
        $.ajax({
            url: 'eliminar.php', // <--- Changed to eliminar_pago.php
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ id: idPago }),
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    Swal.fire({ // Using SweetAlert2 for better UI
                        icon: 'success',
                        title: 'Eliminado!',
                        text: 'Pago eliminado correctamente.',
                        showConfirmButton: false,
                        timer: 1500
                    }).then(() => {
                        $('#tablaPagos').DataTable().ajax.reload(); // Recargar la tabla
                    });
                } else {
                    Swal.fire('Error', 'Error al eliminar pago: ' + response.message, 'error');
                }
            },
            error: function(xhr, status, error) {
                console.error("AJAX error:", xhr.responseText, status, error);
                Swal.fire('Error', 'Error al eliminar pago. Verifique la consola para más detalles. ' + (xhr.responseText ? 'Respuesta del servidor: ' + xhr.responseText : error), 'error');
            }
        });
    }
}