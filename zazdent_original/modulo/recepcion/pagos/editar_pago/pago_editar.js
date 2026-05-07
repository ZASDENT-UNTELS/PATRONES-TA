document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('formEditarPago');
    const idPagoInput = document.getElementById('id_pago');
    const idCitaSelect = document.getElementById('id_cita');
    const montoInput = document.getElementById('monto');
    const metodoPagoSelect = document.getElementById('metodo_pago');
    const estadoSelect = document.getElementById('estado');
    const fechaPagoInput = document.getElementById('fecha_pago');
    const referenciaInput = document.getElementById('referencia');
    const notasTextarea = document.getElementById('notas');

    // Función para cargar las citas en el select (similar a pago_registro.js)
    async function cargarCitas(selectedCitaId = null) {
        try {
            // Asume que 'obtener_citas_activas.php' está en la misma carpeta o ajusta la ruta
            const response = await fetch('obtener_datos.php'); 
            const result = await response.json();

            if (result.success) {
                idCitaSelect.innerHTML = '<option value="">Seleccione una cita...</option>';
                if (result.data.length > 0) {
                    result.data.forEach(cita => {
                        const option = document.createElement('option');
                        option.value = cita.id_cita;
                        option.textContent = `Cita #${cita.id_cita} - ${cita.nombre_paciente} (${cita.fecha_hora})`;
                        idCitaSelect.appendChild(option);
                    });
                    // Seleccionar la cita si se proporcionó un ID
                    if (selectedCitaId) {
                        idCitaSelect.value = selectedCitaId;
                    }
                } else {
                    idCitaSelect.innerHTML = '<option value="">No hay citas disponibles</option>';
                }
            } else {
                Swal.fire('Error', 'No se pudieron cargar las citas: ' + result.message, 'error');
            }
        } catch (error) {
            console.error('Error al obtener citas:', error);
            Swal.fire('Error', 'Error de red al cargar citas. Verifique su conexión.', 'error');
        }
    }

    // Función para cargar los datos del pago específico
    async function cargarDatosPago(idPago) {
        try {
            const response = await fetch(`obtener_pago.php?id=${idPago}`); // Ajusta la ruta si es necesario
            const result = await response.json();

            if (result.success && result.data) {
                const pago = result.data;
                idPagoInput.value = pago.id_pago;
                montoInput.value = parseFloat(pago.monto).toFixed(2);
                metodoPagoSelect.value = pago.metodo_pago;
                estadoSelect.value = pago.estado;
                referenciaInput.value = pago.referencia || '';
                notasTextarea.value = pago.notas || '';

                // Formatear la fecha para el input datetime-local
                const fechaHora = new Date(pago.fecha_pago);
                const year = fechaHora.getFullYear();
                const month = (fechaHora.getMonth() + 1).toString().padStart(2, '0');
                const day = fechaHora.getDate().toString().padStart(2, '0');
                const hours = fechaHora.getHours().toString().padStart(2, '0');
                const minutes = fechaHora.getMinutes().toString().padStart(2, '0');
                fechaPagoInput.value = `${year}-${month}-${day}T${hours}:${minutes}`;

                // Cargar las citas y luego seleccionar la correspondiente
                await cargarCitas(pago.id_cita);

            } else {
                Swal.fire('Error', result.message || 'Pago no encontrado.', 'error').then(() => {
                    window.location.href = '../pago.html'; // Redirigir si no se encuentra el pago
                });
            }
        } catch (error) {
            console.error('Error al cargar datos del pago:', error);
            Swal.fire('Error', 'Error de red al cargar los datos del pago. ' + error.message, 'error').then(() => {
                window.location.href = '../pago.html';
            });
        }
    }

    // Manejar el envío del formulario de edición
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Validar el formulario de Bootstrap
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
        }
        form.classList.remove('was-validated');

        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        try {
            // Asegúrate de que esta ruta sea correcta
            const response = await fetch('actualizar_pago.php', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (!response.ok) { // Si la respuesta HTTP no es 2xx
                throw new Error(result.message || 'Error desconocido al actualizar el pago');
            }

            if (result.success) {
                Swal.fire({
                    icon: 'success',
                    title: '¡Actualización exitosa!',
                    text: 'Pago actualizado correctamente.',
                    timer: 2000,
                    showConfirmButton: false
                }).then(() => {
                    // Opcional: recargar la tabla de pagos o redirigir
                    window.location.href = '../pago.html'; 
                });
            } else {
                Swal.fire('Error', result.message || 'Error al actualizar pago', 'error');
            }

       } catch (error) {
    console.error('Error de red o servidor al actualizar:', error);
    Swal.fire('Error', error.message, 'error');
} finally {
    Swal.fire({
        title: '¡Actualización exitoso!',
        text: 'El pago se ha actualizado correctamente. Redirigiendo en 2 segundos...',
        icon: 'success',
        timer: 2000, // Cierra el mensaje automáticamente en 5 segundos
        showConfirmButton: false
    });

    setTimeout(() => {
        window.location.href = '../pago.html';
    }, 2000);
}
    });

    // Obtener el ID del pago de la URL y cargar los datos
    const urlParams = new URLSearchParams(window.location.search);
    const idPago = urlParams.get('id');
    
    if (idPago) {
        cargarDatosPago(idPago);
    } else {
        Swal.fire('Error', 'No se proporcionó ID de pago para editar.', 'error').then(() => {
            window.location.href = '../pago.html';
        });
    }
});