var API = "4.228.231.149"; //Setar essa variavel quando subir para a nuvem e comentar a localhost
// var API = "localhost"; //Setar essa variavel quando testar local e comentar a do IP

const emailUsuario = localStorage.getItem("email");
var token = localStorage.getItem("tokenAcesso");
buscarUsuario(emailUsuario);

document.getElementById('btn-usuario').addEventListener('click', () => {
    window.location.href = "ListagemUsuario.html";
});

document.getElementById('btn-ingrediente').addEventListener('click', () => {
    window.location.href = "ListagemIngrediente.html";
});

document.getElementById('btn-produto').addEventListener('click', () => {
    window.location.href = "ListagemProduto.html";
});

function buscarUsuario(email) {
    fetch(`http://` + API + `:8080/api/usuarioLogado?email=${email}`, {
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
        document.getElementById("login_user").innerHTML = "Olá, " + primeiroNome + ' (' + data.permissao + ')';
        if(data.permissao === 'ESTOQUISTA') {
            document.getElementById('btn-usuario').style.display = 'none';
        }
    })
    .catch(error => {
        console.error('Erro ao fazer login:', error);
        alert("Erro ao acessar usuário. Por favor, tente novamente.");
    });
}