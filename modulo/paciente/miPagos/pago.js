document.addEventListener('DOMContentLoaded', function() {
    let todosLosPagos = [];

    // --- Payments Section JS ---
    cargarPagos(); // Load payments on startup

    // Set up filtering events for payments
    document.getElementById('filtroBusqueda').addEventListener('input', filtrarPagos);
    document.getElementById('filtroEstado').addEventListener('change', filtrarPagos);
    document.getElementById('filtroMetodo').addEventListener('change', filtrarPagos);
async function cargarPagos() {
    console.info('Iniciando carga de pagos...');
    try {
        const response = await fetch('obtenerPagos.php');
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.message || 'Error en la respuesta del servidor');
        }
        
        todosLosPagos = data.data;
        actualizarTotales(todosLosPagos);
        mostrarPagos(todosLosPagos);
        
    } catch (error) {
        console.error('Error al cargar pagos:', error);
        document.getElementById('pagosContainer').innerHTML = `
            <div class="col-12">
                <div class="alert alert-danger text-center" role="alert">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    ${error.message || 'Error desconocido al cargar pagos'}
                </div>
            </div>
        `;
        actualizarTotales([]);
    }
}

    function actualizarTotales(pagos) {
        const total = pagos.reduce((sum, pago) => sum + parseFloat(pago.monto || 0), 0);
        const pagado = pagos
            .filter(pago => pago.estado === 'Completado')
            .reduce((sum, pago) => sum + parseFloat(pago.monto || 0), 0);

        document.getElementById('totalPagos').textContent = `$${total.toFixed(2)}`;
        document.getElementById('totalPagado').textContent = `$${pagado.toFixed(2)}`;
        console.log(`Totales actualizados: Total = $${total.toFixed(2)}, Pagado = $${pagado.toFixed(2)}`); // For debugging
    }

    function mostrarPagos(pagos) {
        const pagosContainer = document.getElementById('pagosContainer');
        if (pagos.length === 0) {
            pagosContainer.innerHTML = `
                <div class="col-12">
                    <div class="alert alert-info text-center" role="alert">
                        <i class="fas fa-info-circle me-2"></i>
                        No se encontraron pagos que coincidan con los filtros.
                    </div>
                </div>
            `;
            console.warn('No hay pagos para mostrar después del filtrado.');
            return;
        }

        let html = '<div class="row">';

        pagos.forEach(pago => {
            const fechaPago = pago.fecha_pago
                ? new Date(pago.fecha_pago).toLocaleDateString('es-ES')
                : 'No aplica';

            const metodoClase = pago.metodo_pago
                ? `metodo-${pago.metodo_pago.toLowerCase().replace(/ /g, '-')}`
                : 'bg-secondary';

            html += `
                <div class="col-sm-6 col-md-4 col-lg-3 mb-4">
                    <div class="card pago-card estado-${pago.estado.toLowerCase().replace(/ /g, '-') || 'desconocido'}">
                        <div class="card-body d-flex flex-column">
                            <div class="d-flex justify-content-between align-items-start mb-2">
                                <span class="badge bg-${pago.estado === 'Completado' ? 'success' :
                                                         pago.estado === 'Pendiente' ? 'warning' :
                                                         pago.estado === 'Reembolsado' ? 'info' :
                                                         pago.estado === 'Cancelado' ? 'danger' : 'secondary'}">
                                    ${pago.estado || 'Desconocido'}
                                </span>
                                <small class="text-muted">#${pago.id_pago}</small>
                            </div>

                            <h5 class="card-title mb-2">$${parseFloat(pago.monto || 0).toFixed(2)}</h5>

                            ${pago.metodo_pago ? `
                                <span class="badge badge-metodo ${metodoClase} mb-2">
                                    <i class="fas fa-${pago.metodo_pago === 'Efectivo' ? 'money-bill-wave' :
                                                      pago.metodo_pago.includes('Tarjeta') ? 'credit-card' :
                                                      'exchange-alt'} me-1"></i>
                                    ${pago.metodo_pago}
                                </span>
                            ` : ''}

                            <p class="card-text mb-1">
                                <i class="far fa-calendar me-1"></i> ${fechaPago}
                            </p>

                            ${pago.referencia ? `
                                <p class="card-text small text-muted mb-3">
                                    <i class="fas fa-hashtag me-1"></i> Ref: ${pago.referencia}
                                </p>
                            ` : ''}
                        </div>
                    </div>
                </div>
            `;
        });

        html += '</div>';
        pagosContainer.innerHTML = html;
        console.log(`Mostrando ${pagos.length} pagos.`);
    }

    function filtrarPagos() {
        const texto = document.getElementById('filtroBusqueda').value.toLowerCase();
        const estado = document.getElementById('filtroEstado').value;
        const metodo = document.getElementById('filtroMetodo').value;

        console.log(`Aplicando filtros: Texto="${texto}", Estado="${estado}", Método="${metodo}"`);

        const pagosFiltrados = todosLosPagos.filter(pago => {
            const coincideTexto = (pago.referencia && pago.referencia.toLowerCase().includes(texto)) ||
                                  (pago.cita_info && pago.cita_info.toLowerCase().includes(texto)) ||
                                  (pago.notas && pago.notas.toLowerCase().includes(texto)) ||
                                  (pago.monto && parseFloat(pago.monto).toFixed(2).includes(texto)) ||
                                  (pago.id_pago && String(pago.id_pago).includes(texto));
            const coincideEstado = estado === '' || pago.estado === estado;
            const coincideMetodo = metodo === '' || pago.metodo_pago === metodo;

            return coincideTexto && coincideEstado && coincideMetodo;
        });

        console.log(`Filtros aplicados: ${pagosFiltrados.length} de ${todosLosPagos.length} pagos coinciden.`);
        mostrarPagos(pagosFiltrados);
    }
});