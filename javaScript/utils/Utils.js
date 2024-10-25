function redirecionarTelaInicial() {
    window.location.href = "TelaInicial.html"
}

function redirecionarDetalheProduto() {
    window.location.href = "TelaDetalheProduto.html"
}

function redirecionarTelaCarrinho() {
    window.location.href = "TelaCarrinho.html"
}

function mostrarLoading() {
    document.getElementById("loadingModal").style.display = "block";
    document.querySelector(".main").classList.add('blur');
}

function esconderLoading() {
    document.getElementById("loadingModal").style.display = "none";
}

function redirecionarTelaLogin() {
    window.location.href = "Login.html"
}