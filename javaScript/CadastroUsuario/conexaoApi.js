document.querySelector(".form").addEventListener("submit", function (event) {
    event.preventDefault();

    const form = event.target;
    if (form.checkValidity() && validarSenha() === true) {
        const usuario = {
            nome: form.querySelector("#nomeCompleto").value,
            cpf: form.querySelector("#cpf").value,
            email: form.querySelector("#email").value,
            senha: form.querySelector('#senha').value,
            permissao: form.querySelector('#permissao').value
        };
        
        cadastrar(usuario);
        document.getElementById("form").addEventListener("click", function () {
            removerInvalidFeedbackClass();
        });
        limparCampos();
    }
});

function cadastrar(usuario) {
    mostrarLoading();
    fetch('http://localhost:8080/api/usuario', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(usuario)
    })
        .then(response => {
            if (response.status === 201) {
                setTimeout(() => {
                    esconderLoading();
                    document.querySelector("#card-modal").style.display = "flex";
                }, 3000);
            } 
            // else if (response.status === 409) {
            //     alert("CPF/E-mail já cadastrado.");
            //     document.querySelector(".main").classList.remove('blur');
            //     esconderLoading();
            // }
        })
        .catch(error => {
            console.error('Erro ao cadastrar usuário:', error);
            alert("Erro ao cadastrar usuário. Por favor, tente novamente.");
            esconderLoading();
            document.querySelector(".main").classList.remove('blur');
        });
}
