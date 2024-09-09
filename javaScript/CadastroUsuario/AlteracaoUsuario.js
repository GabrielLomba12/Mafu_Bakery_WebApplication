// var API = "4.228.231.149"; //Setar essa variavel quando subir para a nuvem e comentar a localhost
var API = "localhost"; //Setar essa variavel quando testar local e comentar a do IP

const emailUsuario = localStorage.getItem("email")
const currentUserPermission = localStorage.getItem('permissao');

document.getElementById('colorBtn').addEventListener('click', ()=> {
    alterarDadosUsuario();
})

async function carregarDadosDoUsuario(userId) {
    const user = await fetch(`http://`+API+`:8080/api/buscaUsuario?id=${userId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json());

    document.getElementById('nomeCompleto').value = user.nome;
    document.getElementById('cpf').value = user.cpf;
    document.getElementById('permissao').value = user.permissao;
    document.getElementById('email').value = user.email;
    document.getElementById('email').disabled = true;

    if (user.email === emailUsuario) {
        document.getElementById('permissao').disabled = true;
    }
}

function alterarDadosUsuario() {
    const form = document.querySelector('.form');

    const usuarioAlterado = {
        nome: form.querySelector("#nomeCompleto").value,
        cpf: form.querySelector("#cpf").value,
        email: form.querySelector("#email").value,
        senha: form.querySelector('#senha').value,
        permissao: form.querySelector('#permissao').value
    };

    
    const email = document.getElementById('email').value
    mostrarLoading();
    fetch(`http://`+API+`:8080/api/alterarUsuario?email=${email}`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(usuarioAlterado)
    })
    .then(response => {
        if (response.status === 200) {
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

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('id');

    if (userId) {
        // Modo de edição: carregar os dados do usuário
        carregarDadosDoUsuario(userId);
        alterarInterfaceParaEdicao();
    }

    const form = document.querySelector('form');
    form.addEventListener('submit', (event) => {
        // Customizar validação
        validarFormulario(event);
    });
});

function validarFormulario(event) {
    const senha = document.getElementById('senha');
    const confirmSenha = document.getElementById('confirmSenha');
    
    // Verifica se as senhas foram preenchidas
    if (senha.value !== "" || confirmSenha.value !== "") {
        // Se uma das senhas for preenchida, ambas são obrigatórias
        if (senha.value.length < 5 || confirmSenha.value.length < 5 || senha.value !== confirmSenha.value) {
            event.preventDefault(); // Impede o envio
            senha.classList.add('is-invalid');
            confirmSenha.classList.add('is-invalid');
        } else {
            senha.classList.remove('is-invalid');
            confirmSenha.classList.remove('is-invalid');
        }
    } else {
        // Senhas estão vazias, remover a classe de invalidação
        senha.classList.remove('is-invalid');
        confirmSenha.classList.remove('is-invalid');
    }
}

function alterarInterfaceParaEdicao() {
    document.querySelector('h1').textContent = 'Edite os dados do usuário!';
    document.querySelector(".modal-heading").textContent = 'Alteração Realizada!';
    document.querySelector(".modal-info").textContent = 'Alteração de usuário realizada com sucesso.';

    document.getElementById('colorBtn').textContent = 'Salvar Alterações';

    // Remover o atributo 'required' dos campos
    document.getElementById('nomeCompleto').removeAttribute('required');
    document.getElementById('cpf').removeAttribute('required');
    document.getElementById('permissao').removeAttribute('required');
    document.getElementById('email').removeAttribute('required');
    document.getElementById('senha').removeAttribute('required');
    document.getElementById('confirmSenha').removeAttribute('required');

    // Remover a classe de validação inválida dos campos
    let inputs = document.querySelectorAll('.form-control');
    inputs.forEach(input => {
        input.classList.remove('is-invalid');
    });

    // Desabilitar o email para edição
    document.getElementById('email').disabled = true;
}

