// Definir a variável API para a URL correta dependendo do ambiente (localhost ou IP)
var API = "localhost"; // Usar "localhost" para testes locais, e o IP para produção (comentado o "localhost")

document.addEventListener('DOMContentLoaded', () => {
    listarPedidosCliente();
});

function listarPedidosCliente() {
    fetch(`http://${API}:8080/api/pedidos/listarPedidos?id=${localStorage.getItem("ClienteId")}`, {
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("tokenAcesso")}`,
            "Content-Type": "application/json"
        }
    })
    .then(response => {
        if (response.ok) return response.json();
        else throw new Error('Falha na requisição');
    })
    .then(data => {
        console.log(data)
        if (data && data.length > 0) {
            const pedidosContainer = document.querySelector(".list-group");
            pedidosContainer.innerHTML = "";  

            data.forEach(pedido => {
                const pedidoElemento = document.createElement("a");
                pedidoElemento.href = "#";
                pedidoElemento.classList.add("teste", "list-group-item", "list-group-item-action", "flex-column", "align-items-start");

                pedidoElemento.innerHTML = 
                `
                    <div class="d-flex w-100 justify-content-between">
                        <h5 class="mb-1" id="pedido-id">Número do Pedido: ${pedido.pedido.id}</h5>
                        <small id="pedido-data">${formatarData(pedido.pedido.dataPedido)}</small>
                    </div>
                    <p class="mb-1" id="pedido-total">Total do Pedido: R$ ${pedido.pedido.totalPedido}</p>
                    <small id="pedido-status">${pedido.pedido.statusPedido.replace('_', ' ')}</small>
                    <div class="botao">
                        <button class="btn btn-primary ml-auto" id="pedido-detalhes" onclick="verDetalhes(${pedido.id})">Ver Detalhes</button>
                    </div>
                `;

                pedidosContainer.appendChild(pedidoElemento);
            });
        } else {
            console.log("Nenhum pedido encontrado.");
        }
    })
    .catch(error => {
        console.log(`Erro: ${error}`);
    });
}

function formatarData(data) {
    const dataObj = new Date(data);
    const dia = String(dataObj.getDate()).padStart(2, '0');
    const mes = String(dataObj.getMonth() + 1).padStart(2, '0');
    const ano = dataObj.getFullYear();
    return `${dia}/${mes}/${ano}`;
}

function verDetalhes(idPedido) {
    console.log(`Ver detalhes do pedido ${idPedido}`);
}
