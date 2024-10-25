// var API = "4.228.231.149"; //Setar essa variavel quando subir para a nuvem e comentar a localhost
var API = "localhost";

var token = localStorage.getItem("tokenAcesso");

document.querySelector('.btn-continuar').addEventListener('click', function (e) {
    e.preventDefault(); // Evita o comportamento padrão de recarregar a página

    if (!token) {
        // Se não houver token, redireciona para a tela de login
        window.location.href = 'Login.html?redirect=carrinho';
    } else {
        window.location.href = 'TelaCheckout.html';
    }
});
