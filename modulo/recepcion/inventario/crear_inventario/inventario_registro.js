document.addEventListener('DOMContentLoaded', function() {
    const registroForm = document.getElementById('registroInventarioForm');
    const mensajeDiv = document.getElementById('mensaje');

    registroForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission

        const formData = new FormData(registroForm);
        const data = Object.fromEntries(formData.entries());

        fetch('registrar_inventario.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errorData => {
                    throw new Error(errorData.message || 'Error en la respuesta del servidor.');
                });
            }
            return response.json();
        })
        .then(result => {
            if (result.success) {
                showMessage('alert-success', result.message);
                registroForm.reset(); // Clear the form
            } else {
                showMessage('alert-danger', result.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showMessage('alert-danger', `Error al registrar el ítem: ${error.message}`);
        });
    });

    function showMessage(type, message) {
        mensajeDiv.classList.remove('d-none', 'alert-success', 'alert-danger');
        mensajeDiv.classList.add(type);
        mensajeDiv.textContent = message;
        setTimeout(() => {
            mensajeDiv.classList.add('d-none');
        }, 5000); // Hide message after 5 seconds
    }
});