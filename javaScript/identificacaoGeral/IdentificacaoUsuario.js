// var API = "4.228.231.149"; //Setar essa variavel quando subir para a nuvem e comentar a localhost
var API = "localhost"; //Setar essa variavel quando testar local e comentar a do IP

var emailUsuario = localStorage.getItem("email");
var permissao = localStorage.getItem("permissao");

const opcoes = document.querySelector('.burger-menu');

document.addEventListener('DOMContentLoaded', ()=> {
    identificarAutenticacao();
    atualizarCarrinho();
});

function identificarAutenticacao() {
    if (emailUsuario && (permissao === "ESTOQUISTA" || permissao === "ADMINISTRADOR")) {
        opcoes.innerHTML = 
        `
            <a href="TelaDadosCliente.html">Meus Dados</a>
            <a href="TelaBackOffice.html">Menu ${permissao}</a>
            <a href="TelaInicial.html" id="logout">Logout</a>
        `;
        document.getElementById('logout').addEventListener('click', realizarLogout);
        buscarUsuario(emailUsuario);

    } else if (emailUsuario && (permissao === "CLIENTE")) {
        opcoes.innerHTML = 
        `
            <a href="TelaDadosCliente.html">Meus Dados</a>
            <a href="TelaInicial.html" id="logout">Logout</a>
        `;
        document.getElementById('logout').addEventListener('click', realizarLogout);
        buscarCliente(emailUsuario)
    } 
    else {
        opcoes.innerHTML = 
        `
            <a href="Login.html">Login</a>
        `;
    }
}

function realizarLogout() {
    localStorage.removeItem("email");
    localStorage.removeItem("permissao");
    localStorage.removeItem("tokenAcesso");

    alert("Logout realizado com sucesso!")
}

function buscarUsuario(email) {
    fetch(`http://${API}:8080/api/usuarioLogado?email=${email}`, {
        method: 'GET',
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Erro ao fazer login');
        }
    })
    .then(data => {
        usuarioLogadoId = data.id;

        let nome = "";
        nome = data.nome;
        let palavras = nome.split(" ");
        let primeiroNome = palavras[0];
        document.getElementById("login_user").innerHTML = `Olá, ` + primeiroNome + "!";
        if(data.permissao === 'ESTOQUISTA') {
            document.getElementById('btn-usuario').style.display = 'none';
        }
    })
    .catch(error => {
        console.error('Erro ao fazer login:', error);
        alert("Erro ao acessar usuário. Por favor, tente novamente.");
    });
}

function buscarCliente(email) {
    fetch(`http://${API}:8080/api/cliente/infoCliente?email=${email}`, {
        method: 'GET',
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Erro ao fazer login');
        }
    })
    .then(data => {
        // usuarioLogadoId = data.id;

        let nome = "";
        nome = data.nomeCompleto;
        let palavras = nome.split(" ");
        let primeiroNome = palavras[0];
        document.getElementById("login_user").innerHTML = `Olá, ` + primeiroNome + "!";
        localStorage.setItem("ClienteId", data.id)
    })
    .catch(error => {
        console.error('Erro ao fazer login:', error);
        alert("Erro ao acessar usuário. Por favor, tente novamente.");
    });
}

function atualizarCarrinho() {
    let quantidadeAtual = 0;
    const produtosCarrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    produtosCarrinho.forEach(produto => {
        quantidadeAtual += produto.quantidade;
    })
    document.getElementById("itens-carrinho").innerText = `[${quantidadeAtual}]`;
}