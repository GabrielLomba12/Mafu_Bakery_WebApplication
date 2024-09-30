var emailUsuario = localStorage.getItem("email");
var permissao = localStorage.getItem("permissao");
var token = localStorage.getItem("tokenAcesso");

const opcoes = document.querySelector('.burger-menu');

document.addEventListener('DOMContentLoaded', identificarAutenticacao);

function identificarAutenticacao() {
    if (emailUsuario && (permissao === "ESTOQUISTA" || permissao === "ADMINISTRADOR")) {
        opcoes.innerHTML = 
        `
            <a href="#perfil">Perfil</a>
            <a href="TelaBackOffice.html">Menu ${permissao}</a>
            <a href="TelaInicial.html" id="logout">Logout</a>
        `;

        document.getElementById('logout').addEventListener('click', realizarLogout);
    } else {
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

