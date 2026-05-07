document.addEventListener('DOMContentLoaded', function() {
    cargarSelectores();
    
    document.getElementById('form-registro-cita').addEventListener('submit', function(e) {
        e.preventDefault();
        registrarCita();
    });
});

// Cargar selectores
function cargarSelectores() {
    // Configurar Select2 para pacientes
    $('#id_paciente').select2({
        placeholder: 'Seleccionar paciente...',
        width: '100%',
        language: 'es',
        minimumInputLength: 0,
        ajax: {
            url: 'obtener_usuario_cita.php',
            dataType: 'json',
            delay: 300,
            data: function(params) {
                return {
                    accion: 'cargarPacientes',
                    search: params.term || ''
                };
            },
            processResults: function(data) {
                return {
                    results: data.map(item => ({
                        id: item.id_paciente,
                        text: item.nombre_completo
                    }))
                };
            },
            // Cargar datos iniciales al abrir
            transport: function(params, success, failure) {
                const $request = $.ajax(params);
                
                $request.then(function(data) {
                    // Si no hay término de búsqueda, guarda los datos para mostrar al abrir
                    if (!params.data.search) {
                        $('#id_paciente').data('initialData', data);
                    }
                    success(data);
                });
                
                return $request;
            }
        },
        // Mostrar todos los resultados iniciales al abrir
        dropdownCssClass: 'show-all-on-open'
    }).on('select2:opening', function() {
        const initialData = $('#id_paciente').data('initialData');
        if (initialData && !$('#id_paciente').data('select2').$dropdown.find('.select2-results__option').length) {
            const formatted = initialData.map(item => ({
                id: item.id_paciente,
                text: item.nombre_completo
            }));
            $('#id_paciente').data('select2').options.set('data', formatted);
        }
    });

    // Configuración similar para tratamientos
    $('#id_tratamiento').select2({
        placeholder: 'Seleccionar tratamiento...',
        width: '100%',
        language: 'es',
        minimumInputLength: 0,
        ajax: {
            url: 'obtener_usuario_cita.php',
            dataType: 'json',
            delay: 300,
            data: function(params) {
                return {
                    accion: 'cargarTratamientos',
                    search: params.term || ''
                };
            },
            processResults: function(data) {
                return {
                    results: data.map(item => ({
                        id: item.id_tratamiento,
                        text: item.nombre,
                        duracion: item.duracion_estimada
                    }))
                };
            },
            transport: function(params, success, failure) {
                const $request = $.ajax(params);
                
                $request.then(function(data) {
                    if (!params.data.search) {
                        $('#id_tratamiento').data('initialData', data);
                    }
                    success(data);
                });
                
                return $request;
            }
        },
        dropdownCssClass: 'show-all-on-open'
    }).on('select2:opening', function() {
        const initialData = $('#id_tratamiento').data('initialData');
        if (initialData && !$('#id_tratamiento').data('select2').$dropdown.find('.select2-results__option').length) {
            const formatted = initialData.map(item => ({
                id: item.id_tratamiento,
                text: item.nombre,
                duracion: item.duracion_estimada
            }));
            $('#id_tratamiento').data('select2').options.set('data', formatted);
        }
    }).on('select2:select', function(e) {
        const duracion = e.params.data.duracion;
        if (duracion) {
            $('#duracion').val(duracion);
        }
    });

    // Configuración similar para dentistas
    $('#id_dentista').select2({
        placeholder: 'Seleccionar dentista...',
        width: '100%',
        language: 'es',
        minimumInputLength: 0,
        ajax: {
            url: 'obtener_usuario_cita.php',
            dataType: 'json',
            delay: 300,
            data: function(params) {
                return {
                    accion: 'cargarDentistas',
                    search: params.term || ''
                };
            },
            processResults: function(data) {
                return {
                    results: data.map(item => ({
                        id: item.id_dentista,
                        text: item.nombre_completo
                    }))
                };
            },
            transport: function(params, success, failure) {
                const $request = $.ajax(params);
                
                $request.then(function(data) {
                    if (!params.data.search) {
                        $('#id_dentista').data('initialData', data);
                    }
                    success(data);
                });
                
                return $request;
            }
        },
        dropdownCssClass: 'show-all-on-open'
    }).on('select2:opening', function() {
        const initialData = $('#id_dentista').data('initialData');
        if (initialData && !$('#id_dentista').data('select2').$dropdown.find('.select2-results__option').length) {
            const formatted = initialData.map(item => ({
                id: item.id_dentista,
                text: item.nombre_completo
            }));
            $('#id_dentista').data('select2').options.set('data', formatted);
        }
    });

    // Asegurar que el campo de búsqueda sea enfocado automáticamente
    $(document).on('select2:open', () => {
        document.querySelector('.select2-search__field').focus();
    });
}

function registrarCita() {
    const form = document.getElementById('form-registro-cita');
    const formData = new FormData(form);
    
    if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return;
    }

    const data = {
        id_paciente: formData.get('id_paciente'),
        id_tratamiento: formData.get('id_tratamiento'),
        id_dentista: formData.get('id_dentista'),
        fecha_hora: formData.get('fecha_hora'),
        duracion: formData.get('duracion'),
        estado: formData.get('estado'),
        notas: formData.get('notas'),
        recordatorio_enviado: formData.get('recordatorio_enviado'),
        creado_por: 4 // ID del usuario logueado (deberías obtenerlo de la sesión)
    };

    fetch('registrar_cita.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(async response => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Error al registrar la cita');
        
        Swal.fire({
            icon: 'success',
            title: '¡Registro exitoso!',
            text: 'Cita registrada correctamente',
            timer: 2000
        }).then(() => {
            window.location.href = '../citas.html';
        });
    })
    .catch(error => {
        Swal.fire('Error', error.message, 'error');
    });
}

// Función para configurar Select2 con búsqueda
function configurarSelect2(selector, placeholder) {
    $(selector).select2({
        placeholder: placeholder,
        width: '100%',
        minimumInputLength: 1,
        language: 'es',
        theme: 'bootstrap-5'
    });
}
