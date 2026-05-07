document.addEventListener('DOMContentLoaded', function() {
    const inventoryTableBody = document.getElementById('inventoryTableBody');
    const searchInput = document.getElementById('searchInput');

    function fetchInventory(searchTerm = '') {
        let url = 'obtener_inventario.php';
        if (searchTerm) {
            url = `buscar.php?search=${encodeURIComponent(searchTerm)}`;
        }

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                inventoryTableBody.innerHTML = ''; // Clear existing rows
                if (data.length > 0) {
                    data.forEach(item => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${item.id_item}</td>
                            <td>${item.nombre}</td>
                            <td>${item.categoria}</td>
                            <td>${item.cantidad}</td>
                            <td>${item.unidad_medida || 'N/A'}</td>
                            <td>${item.stock_minimo}</td>
                            <td>${item.proveedor || 'N/A'}</td>
                            <td>$${parseFloat(item.costo_unitario || 0).toFixed(2)}</td>
                            <td>${item.ubicacion || 'N/A'}</td>
                            <td>${item.actualizado_en}</td>
                            <td>
                                <a href="editar_inventario/inventario_editar.html?id=${item.id_item}" class="btn btn-info btn-sm btn-action" title="Editar">
                                    <i class="fas fa-edit"></i>
                                </a>
                                <button class="btn btn-danger btn-sm btn-action delete-btn" data-id="${item.id_item}" title="Eliminar">
                                    <i class="fas fa-trash-alt"></i>
                                </button>
                            </td>
                        `;
                        inventoryTableBody.appendChild(row);
                    });
                } else {
                    inventoryTableBody.innerHTML = '<tr><td colspan="11" class="text-center">No se encontraron ítems en el inventario.</td></tr>';
                }
            })
            .catch(error => {
                console.error('Error fetching inventory:', error);
                inventoryTableBody.innerHTML = `<tr><td colspan="11" class="text-center text-danger">Error al cargar el inventario: ${error.message}</td></tr>`;
            });
    }

    // Initial load of inventory
    fetchInventory();

    // Search functionality
    searchInput.addEventListener('keyup', function() {
        const searchTerm = this.value;
        fetchInventory(searchTerm);
    });

    // Event delegation for delete buttons
    inventoryTableBody.addEventListener('click', function(event) {
        if (event.target.classList.contains('delete-btn') || event.target.closest('.delete-btn')) {
            const deleteButton = event.target.closest('.delete-btn');
            const itemId = deleteButton.dataset.id;
            if (confirm(`¿Estás seguro de que quieres eliminar el ítem con ID ${itemId}?`)) {
                deleteItem(itemId);
            }
        }
    });

    function deleteItem(itemId) {
        fetch('eliminar.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `id_item=${itemId}`
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errorData => {
                    throw new Error(errorData.message || 'Error al eliminar el ítem.');
                });
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                alert(data.message);
                fetchInventory(); // Reload inventory after deletion
            } else {
                alert(data.message);
            }
        })
        .catch(error => {
            console.error('Error deleting item:', error);
            alert(`Error al eliminar el ítem: ${error.message}`);
        });
    }
});