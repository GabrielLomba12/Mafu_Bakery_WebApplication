var API = "4.228.231.149"; //Setar essa variavel quando subir para a nuvem e comentar a localhost
// var API = "localhost"; //Setar essa variavel quando testar local e comentar a do IP

let token = localStorage.getItem("tokenAcesso");

document.querySelector(".form").addEventListener("submit", function (event) {
    event.preventDefault();

    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('id'); // Verifica se é edição

    const form = event.target;
    if (form.checkValidity() && validarSenha() === true) {
        const usuario = {
            nome: form.querySelector("#nomeCompleto").value,
            cpf: form.querySelector("#cpf").value,
            email: form.querySelector("#email").value,
            senha: form.querySelector('#senha').value,
            permissao: form.querySelector('#permissao').value
        };
        
        const method = userId ? 'PATCH' : 'POST';
        const url = userId ? `http://`+API+`:8080/api/alterarUsuario?email=${usuario.email}` : `http://`+API+`:8080/api/usuario`;
        cadastrar_alterar(usuario, method, url);
        document.querySelector(".form").addEventListener("click", function () {
            removerInvalidFeedbackClass();
        });
        limparCampos();
    }
});

function cadastrar_alterar(usuario, method, url) {
    mostrarLoading();
    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(usuario)
    })
    .then(response => {
        if (response.status === 201 || response.status === 200) {
            setTimeout(() => {
                esconderLoading();
                document.querySelector("#card-modal").style.display = "flex";
            }, 3000);
        } 
        else if (response.status === 409) {
            alert("CPF/E-mail já cadastrado.");
            document.querySelector(".main").classList.remove('blur');
            esconderLoading();
        }
    })
    .catch(error => {
        console.error('Erro ao cadastrar ou alterar usuário:', error);
        alert("Erro ao cadastrar ou alterar usuário. Por favor, tente novamente.");
        esconderLoading();
        document.querySelector(".main").classList.remove('blur');
    });
}