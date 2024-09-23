(() => {
    'use strict';

    const forms = document.querySelectorAll('.form');

    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            // Ignora campos específicos da validação
            const ingrediente = document.getElementById('ingrediente');
            const qtdIngrediente = document.getElementById('qtd-ingrediente');
            
            ingrediente.removeAttribute('required');
            qtdIngrediente.removeAttribute('required');

            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }

            form.classList.add('was-validated');
        }, false);
    });
})();
