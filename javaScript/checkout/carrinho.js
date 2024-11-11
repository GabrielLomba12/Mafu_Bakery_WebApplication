var API = "4.228.231.149"; //Setar essa variavel quando subir para a nuvem e comentar a localhost
// var API = "localhost";

var token = localStorage.getItem("tokenAcesso");

document.querySelector('.btn-continuar').addEventListener('click', function (e) {
    e.preventDefault(); // Evita o comportamento padrão de recarregar a página

    if (!token) {
        window.location.href = 'Login.html?redirect=carrinho';
    } else {
        if(valorDeFrete === 0){
            alert("Por favor, selecione uma opção de frete antes de continuar.")
            return
        }
        window.location.href = 'TelaCheckout.html';
    }
});
