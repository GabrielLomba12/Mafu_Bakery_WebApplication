var API = "4.228.231.149"; //Setar essa variavel quando subir para a nuvem e comentar a localhost
// var API = "localhost";

const emailUser = localStorage.getItem("email");
var token = localStorage.getItem("tokenAcesso");

if(emailUser && token) 
    buscarUsuario(emailUser);

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
        if(data.permissao === "ADMINISTRADOR" || data.permissao === "ESTOQUISTA") {
            document.getElementById("login_user").innerHTML = "Olá, " + primeiroNome + ' (' + data.permissao + ')';
        } else 
            document.getElementById("login-user").innerHTML = "Olá " + primeiroNome;

        if(data.permissao === 'ESTOQUISTA') {
            document.getElementById('btn-usuario').style.display = 'none';
        }
    })
    .catch(error => {
        console.error('Erro ao buscar dados de usuário logado:', error);
        alert("Erro ao acessar usuário. Por favor, tente novamente.");
    });
}