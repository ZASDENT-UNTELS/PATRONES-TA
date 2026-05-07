document.addEventListener('DOMContentLoaded', function() {
    const citasContainer = document.getElementById('citasContainer');
    const filtroBusqueda = document.getElementById('filtroBusqueda');
    const filtroEstado = document.getElementById('filtroEstado');
    const detalleCitaModal = new bootstrap.Modal(document.getElementById('detalleCitaModal'));
    
    // Esta variable CRÍTICA almacenará TODAS las citas una vez cargadas.
    let todasLasCitas = [];

    // 1. Cargar citas al iniciar la página.
    // La función cargarCitas ahora se encarga de fetchear y también de poblar 'todasLasCitas'.
    cargarCitas();

    // 2. Configurar eventos de filtrado. Estos eventos llamarán a filtrarCitas, 
    // que trabajará sobre 'todasLasCitas'.
    filtroBusqueda.addEventListener('input', filtrarCitas);
    filtroEstado.addEventListener('change', filtrarCitas);

    async function cargarCitas() {
        try {
            // Mostrar un estado de carga mientras se obtienen los datos
            citasContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-spinner fa-spin fa-3x mb-3"></i>
                    <p>Cargando tus citas...</p>
                </div>
            `;

            const response = await fetch('MostrarCitas.php');
            
            if (!response.ok) {
                // Intenta obtener un mensaje de error más específico del servidor
                const errorData = await response.json(); 
                throw new Error(errorData.message || `Error HTTP: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.message || 'Error al obtener citas: respuesta no exitosa del servidor.');
            }
            
            // *** CORRECCIÓN CLAVE 1: POBLEMOS todasLasCitas ***
            todasLasCitas = data.data; 
            
            // *** CORRECCIÓN CLAVE 2: Llamamos a filtrarCitas para mostrar las iniciales ***
            // Esto asegura que se muestren las citas cargadas por primera vez, 
            // y si hay algún filtro preseleccionado, también se aplique.
            filtrarCitas(); 
            
        } catch (error) {
            console.error('Error al cargar citas:', error);
            // Mostrar un mensaje de error al usuario
            mostrarError(`Error al cargar las citas: ${error.message}. Por favor, inténtalo de nuevo.`);
        }
    }

    function mostrarCitas(citas) {
        // Si el array de citas (ya filtradas o no) está vacío, mostrar el mensaje de "no hay citas".
        if (citas.length === 0) {
            citasContainer.innerHTML = `
                <div class="empty-state">
                    <i class="far fa-calendar-times fa-3x mb-3"></i>
                    <h4>No tienes citas programadas que coincidan con los filtros.</h4>
                    <p>Intenta ajustar tu búsqueda o filtros.</p>
                </div>
            `;
            return;
        }

        let html = '';
        citas.forEach(cita => {
            const fechaHora = new Date(cita.fecha_hora);
            const fecha = fechaHora.toLocaleDateString('es-ES', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
            const hora = fechaHora.toLocaleTimeString('es-ES', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });

            html += `
                <div class="col-md-6 col-lg-4">
                    <div class="card card-cita h-100" data-id="${cita.id_cita}">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-start mb-3">
                                <span class="badge rounded-pill badge-estado estado-${cita.estado.toLowerCase().replace(' ', '-')}">
                                    ${cita.estado}
                                </span>
                                <small class="text-muted">#${cita.id_cita}</small>
                            </div>
                            <h5 class="card-title">${cita.tratamiento}</h5>
                            <p class="card-text">
                                <i class="far fa-calendar me-2"></i>${fecha}<br>
                                <i class="far fa-clock me-2"></i>${hora} (${cita.duracion} mins)
                            </p>
                            ${cita.dentista ? `<p class="card-text"><i class="fas fa-user-md me-2"></i>Dr. ${cita.dentista}</p>` : ''}
                            <button class="btn btn-outline-primary btn-sm ver-detalle" data-id="${cita.id_cita}">
                                <i class="fas fa-info-circle me-1"></i> Ver detalles
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });

        citasContainer.innerHTML = html;
        
        // *** CORRECCIÓN CLAVE 3: Re-adjuntar eventos a los botones "Ver detalles" ***
        // Esto es necesario porque cada vez que se actualiza el innerHTML, los elementos anteriores se eliminan
        // y se crean nuevos, perdiendo los event listeners adjuntos.
        document.querySelectorAll('.ver-detalle').forEach(btn => {
            btn.addEventListener('click', function() {
                const idCita = this.getAttribute('data-id');
                mostrarDetalleCita(idCita);
            });
        });
    }

    function filtrarCitas() {
        const texto = filtroBusqueda.value.toLowerCase();
        const estado = filtroEstado.value;
        
        // La lógica de filtrado opera sobre 'todasLasCitas'.
        const citasFiltradas = todasLasCitas.filter(cita => {
            // Asegúrate de que las propiedades existan antes de llamar a .toLowerCase() para evitar errores
            const coincideTexto = 
                (cita.tratamiento && cita.tratamiento.toLowerCase().includes(texto)) || 
                (cita.dentista && cita.dentista.toLowerCase().includes(texto));
            
            const coincideEstado = estado === '' || (cita.estado && cita.estado === estado);
            
            return coincideTexto && coincideEstado;
        });
        
        // Luego, llama a mostrarCitas con el subconjunto filtrado.
        mostrarCitas(citasFiltradas);
    }

    function mostrarDetalleCita(idCita) {
        // Busca la cita específica en 'todasLasCitas' usando el ID.
        const cita = todasLasCitas.find(c => c.id_cita == idCita);
        if (!cita) {
            console.warn(`Cita con ID ${idCita} no encontrada en todasLasCitas.`);
            return;
        }

        const fechaHora = new Date(cita.fecha_hora);
        const fecha = fechaHora.toLocaleDateString('es-ES', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        const hora = fechaHora.toLocaleTimeString('es-ES', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });

        let contenido = `
            <div class="mb-3">
                <h6>Tratamiento</h6>
                <p>${cita.tratamiento}</p>
            </div>
            <div class="row mb-3">
                <div class="col-md-6">
                    <h6>Fecha</h6>
                    <p>${fecha}</p>
                </div>
                <div class="col-md-6">
                    <h6>Hora</h6>
                    <p>${hora} (${cita.duracion} minutos)</p>
                </div>
            </div>
            <div class="mb-3">
                <h6>Estado</h6>
                <span class="badge rounded-pill badge-estado estado-${cita.estado.toLowerCase().replace(' ', '-')}">
                    ${cita.estado}
                </span>
            </div>
        `;

        if (cita.dentista) {
            contenido += `
                <div class="mb-3">
                    <h6>Dentista</h6>
                    <p>Dr. ${cita.dentista}</p>
                </div>
            `;
        }

        if (cita.notas) {
            contenido += `
                <div class="mb-3">
                    <h6>Notas adicionales</h6>
                    <p>${cita.notas}</p>
                </div>
            `;
        }

        document.getElementById('detalleCitaContent').innerHTML = contenido;
        detalleCitaModal.show();
    }

    // Función para mostrar errores de forma amigable
    function mostrarError(message) {
        citasContainer.innerHTML = `
            <div class="empty-state alert alert-danger" role="alert">
                <i class="fas fa-exclamation-triangle fa-3x mb-3"></i>
                <h4>¡Ha ocurrido un error!</h4>
                <p>${message}</p>
            </div>
        `;
    }
});