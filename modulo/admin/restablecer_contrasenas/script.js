document.addEventListener('DOMContentLoaded', function() {
    const emailForm = document.getElementById('email-form');
    const errorContainer = document.getElementById('error-container');
    
    emailForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        
        // Validación básica del email
        if (!validateEmail(email)) {
            showError("Por favor ingresa un correo electrónico válido");
            return;
        }
        
        try {
            // Enviar solicitud al servidor
            const response = await fetch('procesar.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    action: 'request_reset',
                    email: email
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                // Guardar datos temporalmente
                sessionStorage.setItem('reset_email', email);
                sessionStorage.setItem('temp_password', data.temp_password);
                
                // Redirigir a página de éxito
                window.location.href = 'exito.html';
            } else {
                showError(data.message || 'Error al procesar la solicitud');
            }
        } catch (error) {
            showError('Error de conexión: ' + error.message);
        }
    });
    
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    function showError(message) {
        errorContainer.textContent = message;
        errorContainer.classList.remove('d-none');
        
        // Ocultar mensaje después de 5 segundos
        setTimeout(() => {
            errorContainer.classList.add('d-none');
        }, 5000);
    }
});