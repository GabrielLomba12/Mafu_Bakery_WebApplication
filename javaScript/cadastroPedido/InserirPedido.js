// var API = "4.228.231.149"; //Setar essa variavel quando subir para a nuvem e comentar a localhost
var API = "localhost"; //Setar essa variavel quando testar local e comentar a do IP

const enderecoJSON = localStorage.getItem('enderecoSelecionado');
const enderecoObj = JSON.parse(enderecoJSON);

const resumoPedidoJSON = localStorage.getItem("resumoPedido");
const resumoPedidoObj = JSON.parse(resumoPedidoJSON);


const produtosJSON = localStorage.getItem("carrinho");
let produtos = [];
produtos = JSON.parse(produtosJSON); 

const itensPedido = produtos.map(produto => {
    return {
        id: produto.id,
        valorUnitario: produto.preco,  
        quantidade: produto.quantidade,
        total: produto.preco * produto.quantidade 
    };
});

document.getElementById("btn-finalizar").addEventListener('click', () => {
    cadastrarPedido();
})

function cadastrarPedido() {
    mostrarLoading();
    const pedido = {
        clienteId: localStorage.getItem("ClienteId"),
        enderecoEntrega: enderecoObj.id,
        produtos: itensPedido,
        formaPagamento: localStorage.getItem("metodoPagamento").toUpperCase(),
        totalPedido: parseFloat(resumoPedidoObj.valorTotalPedido).toFixed(2),
        subtotal: parseFloat(resumoPedidoObj.valorProdutos).toFixed(2),
        frete: parseFloat(localStorage.getItem("valorFrete"))
    }

    fetch(`http://${API}:8080/api/pedidos/realizarPedido`, {
        method: 'POST',
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("tokenAcesso")}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(pedido)
    })
    .then(response => {
        if(response.ok)
            return response.json();
    })
    .then(data => {
        console.log(data)
        if(data) {
            setTimeout(() => {
                esconderLoading();
                document.getElementById("card-modal").style.display = "flex";
                console.log(data);
                exibirDadosPedido(data);
                document.getElementById("botaook").addEventListener('click', () => {
                    limparCarrinhoAposCompra();
                    window.location.href = 'TelaInicial.html';
                });
            }, 3000);
        }
    })
    .catch(error => {
        console.log(`Error ${error}`);
    })
}

function limparCarrinhoAposCompra() {
    localStorage.removeItem("carrinho");
    localStorage.removeItem("enderecoSelecionado");
    localStorage.removeItem("metodoPagamento");
    localStorage.removeItem("valorTotalPedido");
    localStorage.removeItem("valorFrete");
    localStorage.removeItem("valorProdutos");
    localStorage.removeItem("resumoPedido");
}

function exibirDadosPedido(data) {
    document.querySelector(".modal-info").innerHTML = 
    `
        Obrigado por comprar na Mafu Bakery!<br>
        <b>Pedido n°: </b> ${data.id}<br>
        <b>Valor Total: </b>R$ ${data.totalPedido}
    `;
}