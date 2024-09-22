function formatarCasasDecimais(numero) {
    return Number(numero).toFixed(2);
}

function redirecionarCadastroProduto() {
    window.location.href = "cadastroProduto.html";
}

function fecharModalProduto() {
    document.querySelector("#card-modal").style.display = "none";   
}

function enviarParaAlteracao(id) {
    window.location.href = `../cadastroProduto.html?id=${id}`
}

const exibirModal = () => {
    document.querySelector('.card-produto').style.display = 'flex';
}

const fecharModal = () => {
    document.querySelector('.card-produto').style.display = 'none';
}