document.addEventListener('DOMContentLoaded', function() {
    const historialContainer = document.getElementById('historialContainer');
    const filtroBusqueda = document.getElementById('filtroBusqueda');
    const filtroFecha = document.getElementById('filtroFecha');
    
    let todosLosRegistros = [];

    // console.log para verificar que el DOMContentLoaded se ejecuta
    console.log('DOM completamente cargado. Iniciando carga de historial...');

    cargarHistorial();

    filtroBusqueda.addEventListener('input', filtrarRegistros);
    filtroFecha.addEventListener('change', filtrarRegistros);

    async function cargarHistorial() {
        console.log('Iniciando función cargarHistorial()...');
        try {
            historialContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-spinner fa-spin fa-3x mb-3 text-primary"></i>
                    <p>Cargando tu historial médico...</p>
                </div>
            `;

            console.log('Haciendo fetch a obtenerHistorial.php...');
            const response = await fetch('obtenerHistorial.php');
            console.log('Respuesta del fetch recibida:', response);
            
            if (!response.ok) {
                const errorText = await response.text(); 
                let errorData;
                try {
                    errorData = JSON.parse(errorText);
                } catch (e) {
                    errorData = { message: errorText || `Error HTTP: ${response.status}` };
                }
                console.error('Error en la respuesta HTTP:', response.status, errorData.message);
                throw new Error(errorData.message || `Error HTTP: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Datos JSON recibidos:', data);
            
            if (!data.success) {
                console.error('La respuesta del servidor indica fallo:', data.message);
                throw new Error(data.message || 'Error al obtener historial: respuesta no exitosa del servidor.');
            }
            
            todosLosRegistros = data.data; 
            console.log('todosLosRegistros poblados:', todosLosRegistros);

            if (todosLosRegistros.length === 0) {
                console.log('No se recibieron registros. Mostrando estado vacío.');
            } else {
                console.log(`Se recibieron ${todosLosRegistros.length} registros. Procesando filtrado inicial.`);
            }
            
            filtrarRegistros(); 
            
        } catch (error) {
            console.error('Error CATCH en cargarHistorial():', error);
            mostrarError(`Error al cargar el historial: ${error.message}. Por favor, inténtalo de nuevo.`);
        }
        console.log('Fin de cargarHistorial().');
    }

    function mostrarHistorial(registros) {
        console.log('Iniciando función mostrarHistorial() con', registros.length, 'registros.');
        if (registros.length === 0) {
            historialContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-file-medical-alt fa-3x mb-3 text-muted"></i>
                    <h4>No se encontraron registros en tu historial médico que coincidan con los filtros.</h4>
                    <p>Intenta ajustar tu búsqueda o filtros.</p>
                </div>
            `;
            console.log('HistorialContainer actualizado: estado vacío.');
            return;
        }

        let html = '<div class="row">';
        registros.forEach(registro => {
            // console.log('Procesando registro:', registro.id_historial, registro.procedimiento);
            const fecha = new Date(registro.fecha_procedimiento);
            const fechaFormateada = fecha.toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            html += `
                <div class="col-md-6 col-lg-4">
                    <div class="card historial-item h-100">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-start mb-3">
                                <h5 class="card-title">${registro.procedimiento || 'Procedimiento no especificado'}</h5>
                                <span class="badge bg-primary">${registro.tratamiento || 'General'}</span>
                            </div>
                            <h6 class="card-subtitle mb-2">
                                <i class="far fa-calendar me-1"></i>${fechaFormateada}
                            </h6>
                            ${registro.dentista ? `<p class="card-text"><i class="fas fa-user-md me-1"></i>Dr. ${registro.dentista}</p>` : ''}
                            
                            ${registro.diagnostico ? `
                                <div class="mt-2">
                                    <span class="badge badge-diagnostico me-1">Diagnóstico</span>
                                    <p class="d-inline text-dark">${registro.diagnostico.substring(0, 70)}${registro.diagnostico.length > 70 ? '...' : ''}</p>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
            `;
        });
        html += '</div>';
        
        historialContainer.innerHTML = html;
        console.log('HistorialContainer actualizado con los registros.');
    }

    function filtrarRegistros() {
        const texto = filtroBusqueda.value.toLowerCase();
        const fechaFiltro = filtroFecha.value;
        console.log(`Iniciando filtrado: Texto="${texto}", Fecha="${fechaFiltro}"`);
        console.log('Registros originales para filtrar:', todosLosRegistros.length);
        
        const registrosFiltrados = todosLosRegistros.filter(registro => {
            const coincideTexto = 
                (registro.diagnostico && registro.diagnostico.toLowerCase().includes(texto)) || 
                (registro.procedimiento && registro.procedimiento.toLowerCase().includes(texto)) ||
                (registro.tratamiento && registro.tratamiento.toLowerCase().includes(texto)) ||
                (registro.dentista && registro.dentista.toLowerCase().includes(texto)); // Asegúrate de incluir dentista y tratamiento en la búsqueda de texto

            let coincideFecha = true;
            if (fechaFiltro !== '') {
                const fechaProcedimiento = new Date(registro.fecha_procedimiento);
                const hoy = new Date();
                switch (fechaFiltro) {
                    case 'ultimo_mes':
                        const ultimoMes = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
                        ultimoMes.setMonth(hoy.getMonth() - 1); // Resta 1 mes
                        coincideFecha = fechaProcedimiento >= ultimoMes;
                        break;
                    case 'ultimos_6_meses':
                        const seisMesesAtras = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
                        seisMesesAtras.setMonth(hoy.getMonth() - 6); // Resta 6 meses
                        coincideFecha = fechaProcedimiento >= seisMesesAtras;
                        break;
                    case 'ultimo_ano':
                        const unAnioAtras = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
                        unAnioAtras.setFullYear(hoy.getFullYear() - 1); // Resta 1 año
                        coincideFecha = fechaProcedimiento >= unAnioAtras;
                        break;
                    case '2_anos':
                        const dosAnosAtras = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
                        dosAnosAtras.setFullYear(hoy.getFullYear() - 2); // Resta 2 años
                        coincideFecha = fechaProcedimiento >= dosAnosAtras;
                        break;
                }
            }
            return coincideTexto && coincideFecha;
        });
        
        console.log('Registros filtrados:', registrosFiltrados.length);
        mostrarHistorial(registrosFiltrados);
    }

    function mostrarError(message) {
        console.error('Mostrando mensaje de error al usuario:', message);
        historialContainer.innerHTML = `
            <div class="empty-state alert alert-danger" role="alert">
                <i class="fas fa-exclamation-triangle fa-3x mb-3 text-danger"></i>
                <h4>¡Ha ocurrido un error!</h4>
                <p>${message}</p>
            </div>
        `;
    }
});