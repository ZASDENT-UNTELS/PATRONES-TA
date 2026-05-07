document.addEventListener('DOMContentLoaded', function() {
    const editarForm = document.getElementById('editarInventarioForm');
    const mensajeDiv = document.getElementById('mensaje');
    const urlParams = new URLSearchParams(window.location.search);
    const itemId = urlParams.get('id');

    if (!itemId) {
        showMessage('alert-danger', 'ID de ítem no proporcionado para la edición.');
        editarForm.style.display = 'none'; // Hide form if no ID
        return;
    }

    // Fetch item details to populate the form
    fetch(`obtener_inventario.php?id=${itemId}`) // This needs to be a specific endpoint to get ONE item
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data && data.length > 0) { // Assuming obtener_inventario.php might return an array
                const item = data[0]; // Get the first item
                document.getElementById('id_item').value = item.id_item;
                document.getElementById('nombre').value = item.nombre;
                document.getElementById('categoria').value = item.categoria;
                document.getElementById('descripcion').value = item.descripcion || '';
                document.getElementById('cantidad').value = item.cantidad;
                document.getElementById('unidad_medida').value = item.unidad_medida || '';
                document.getElementById('stock_minimo').value = item.stock_minimo;
                document.getElementById('proveedor').value = item.proveedor || '';
                document.getElementById('costo_unitario').value = parseFloat(item.costo_unitario || 0).toFixed(2);
                document.getElementById('ubicacion').value = item.ubicacion || '';
                document.getElementById('activo').checked = item.activo == 1; // Checkbox for active status
            } else {
                showMessage('alert-danger', 'Ítem no encontrado.');
                editarForm.style.display = 'none';
            }
        })
        .catch(error => {
            console.error('Error fetching item for edit:', error);
            showMessage('alert-danger', `Error al cargar datos del ítem: ${error.message}`);
            editarForm.style.display = 'none';
        });

    editarForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData(editarForm);
        const data = Object.fromEntries(formData.entries());

        // Handle checkbox value (checked sends '1', unchecked sends nothing)
        data.activo = document.getElementById('activo').checked ? 1 : 0;

        fetch('actualizar_inventario.php', {
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
                // Optionally redirect or update UI
            } else {
                showMessage('alert-danger', result.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showMessage('alert-danger', `Error al actualizar el ítem: ${error.message}`);
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