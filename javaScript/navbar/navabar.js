var API = "localhost";

const emailUser = localStorage.getItem("email");
var token = localStorage.getItem("tokenAcesso");
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