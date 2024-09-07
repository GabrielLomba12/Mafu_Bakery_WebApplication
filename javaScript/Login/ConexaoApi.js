// import { loginUsuario } from "./Login";
// var API = "4.228.231.149"; //Setar essa variavel quando subir para a nuvem e comentar a localhost
var API = "localhost"; //Setar essa variavel quando testar local e comentar a do IP

const formulario = document.querySelector("form")
const email = document.querySelector(".email")
const senha = document.querySelector(".senha")
const btnLogin = document.querySelector(".btn-login");
const show = document.querySelector(".modal-confirm");

function validarCampos() {
    const emailValue = email.value;
    const senhaValue = senha.value;

    // Verifica se o campo de e-mail está vazio
    if (emailValue.trim() === '') {
        alert("Por favor, preencha o campo de e-mail.");
        email.focus();
        return;
    }

    // Verifica se o campo de senha está vazio
    if (senhaValue.trim() === '') {
        alert("Por favor, preencha o campo de senha.");
        senha.focus();
        return;
    }
}

document.querySelector('.btn-login').addEventListener('click', function (event) {
    event.preventDefault();
    validarCampos();
    loginUsuario();
});

function limparCampos() {
    document.querySelector(".card-login").reset();
}

function irTelaInicial(){
    const modal = document.querySelector('.cartao');

    // Função para abrir o modal
    const openModal = () => {
        modal.style.display = 'flex';
    };

    // Quando o usuário clicar no botão, abre o modal
    openModal()
}

function loginInvalido() {
    const modal = document.querySelector('#not-valid');
    const btnOk = document.querySelector('#clicked'); 

    // Função para abrir o modal
    const openModal = () => {
        modal.style.display = 'flex';
    };

    // Função para fechar o modal
    const closeModal = () => {
        modal.style.display = 'none';
    };

    // Abre o modal
    openModal();

    // Adiciona o evento de clique ao botão 'btnOk'
    if (btnOk) {
        btnOk.addEventListener('click', (event) => {
            console.log("Botão OK clicado");
            closeModal();
        });
    } else {
        console.error("Elemento '.inicial' não encontrado.");
    }

    // Adiciona evento para fechar o modal ao clicar fora dele
    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            closeModal();
        }
    });
}

document.addEventListener("DOMContentLoaded", function() {
    document.querySelector('.btn-login').addEventListener('click', function (event) {
        event.preventDefault();
        validarCampos();
        loginUsuario();
    });
});

function redirecionar() {
    window.location.href = "TelaBackOffice.html";
}

function loginUsuario() {
    fetch('http://' + API + ':8080/api/auth/signin', {
        method: 'POST',
        headers: {
            'Content-Type': "application/json"
        },
        body: JSON.stringify({
            email: email.value,
            senha: senha.value
        })
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Erro ao fazer login');
        }
    })
    .then(data => {
        const email = data.email;
        const permissao = data.permissao;
        const token = data.tokenAcesso;
        localStorage.setItem("permissao", permissao);
        localStorage.setItem("email", email);
        localStorage.setItem("tokenAcesso", token);
        const elementoCard = document.querySelector(".cartao");
        if (elementoCard) {
            if (permissao === "ADMINISTRADOR" || permissao === "ESTOQUISTA") {
                elementoCard.style.display = "flex";
            }
        } else {
            console.error("Elemento com a classe '.cartao' não encontrado.");
        }
    })
    .catch(error => {
        console.error('Erro ao fazer login:', error);
    });
}

document.querySelector('.tela-back-office').addEventListener('click', function (event) {
    redirecionar();
});
