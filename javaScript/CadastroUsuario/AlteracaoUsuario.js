// var API = "4.228.231.149"; //Setar essa variavel quando subir para a nuvem e comentar a localhost
var API = "localhost"; //Setar essa variavel quando testar local e comentar a do IP

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('id');

    if (userId) {
        // Modo de edição: carregar os dados do usuário
        carregarDadosDoUsuario(userId);
        alterarInterfaceParaEdicao();
    }
});

async function carregarDadosDoUsuario(userId) {
    const user = await fetch(`http://`+API+`:8080/api/buscaUsuario?id=${userId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json());

    document.getElementById('nomeCompleto').value = user.nome;
    document.getElementById('cpf').value = user.cpf;
    document.getElementById('permissao').value = user.permissao;
    document.getElementById('email').value = user.email;
    document.getElementById('email').disabled = true;
}

function alterarInterfaceParaEdicao() {

    document.querySelector('h1').textContent = 'Edite os dados do usuário!';
    document.querySelector(".modal-heading").textContent = 'Alteração Realizada!';
    document.querySelector(".modal-info").textContent = 'Alteração de usuário realizada com sucesso.';

    document.getElementById('colorBtn').textContent = 'Salvar Alterações';
    document.getElementById('colorBtn').

    document.getElementById('nomeCompleto').required = false;
    document.getElementById('cpf').required = false;
    document.getElementById('permissao').required = false;
    document.getElementById('senha').required = false;
    document.getElementById('confirmSenha').required = false;
    
}