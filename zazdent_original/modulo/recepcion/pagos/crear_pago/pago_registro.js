document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('form-registro-pago');
    const idCitaSelect = document.getElementById('id_cita');
    const fechaPagoInput = document.getElementById('fecha_pago');

    // Establecer la fecha y hora actual por defecto
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    fechaPagoInput.value = `${year}-${month}-${day}T${hours}:${minutes}`;

    // Función para cargar las citas en el select
    async function cargarCitas() {
        try {
            const response = await fetch('obtener_datos.php'); // Asegúrate de que esta ruta sea correcta
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
                } else {
                    idCitaSelect.innerHTML = '<option value="">No hay citas disponibles para pagar</option>';
                    idCitaSelect.disabled = true; // Deshabilitar si no hay opciones
                }
            } else {
                idCitaSelect.innerHTML = '<option value="">Error al cargar citas</option>';
                idCitaSelect.disabled = true;
                Swal.fire('Error', 'No se pudieron cargar las citas: ' + result.message, 'error');
            }
        } catch (error) {
            console.error('Error al obtener citas:', error);
            idCitaSelect.innerHTML = '<option value="">Error de red al cargar citas</option>';
            idCitaSelect.disabled = true;
            Swal.fire('Error', 'Error de red al cargar citas. Verifique su conexión o la ruta del script.', 'error');
        }
    }

    // Cargar citas al iniciar la página
    cargarCitas();

    // Manejar el envío del formulario
    form.addEventListener('submit', async function(e) {
        e.preventDefault(); // Evitar el envío tradicional del formulario

        // Validar el formulario de Bootstrap
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
        }
        form.classList.remove('was-validated'); // Quitar la clase si es válido

        // Crear objeto de datos para enviar
        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        try {
            const response = await fetch('registrar_pago.php', { // Asegúrate de que esta ruta sea correcta
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (!response.ok) { // Si la respuesta HTTP no es 2xx
                throw new Error(result.message || 'Error desconocido al registrar el pago');
            }

            if (result.success) {
                Swal.fire({
                    icon: 'success',
                    title: '¡Registro exitoso!',
                    text: 'Pago registrado correctamente.',
                    timer: 2000,
                    showConfirmButton: false
                }).then(() => {
                    form.reset(); // Limpiar el formulario
                    fechaPagoInput.value = `${year}-${month}-${day}T${hours}:${minutes}`; // Re-establecer fecha actual
                    cargarCitas(); // Recargar las citas para actualizar la lista
                });
            } else {
                Swal.fire('Error', result.message || 'Error al registrar pago', 'error');
            }

       } catch (error) {
    console.error('Error de red o servidor:', error);

    Swal.fire({
        title: 'Error',
        text: error.message || 'Hubo un problema al procesar la solicitud.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
    });

} finally {
    Swal.fire({
        title: '¡Registro exitoso!',
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
});