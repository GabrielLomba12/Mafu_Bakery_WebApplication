// Definir a variável API para a URL correta dependendo do ambiente (localhost ou IP)
var API = "localhost"; // Usar "localhost" para testes locais, e o IP para produção (comentado o "localhost")

let pedidosData = [];

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
            pedidosData = data;
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
                        <button class="btn ml-auto" id="pedido-detalhes" onclick="verDetalhes(${pedido.pedido.id})">Ver Detalhes</button>
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
    const pedido = pedidosData.find(p => p.pedido.id === idPedido); 

    if (pedido) {
        document.getElementById('det-id').textContent = `Detalhes do Pedido: ${idPedido}`;
        document.getElementById('pagamento').textContent = `Forma de Pagamento: ${pedido.pedido.formaPagamento}`;
        document.getElementById('status-pedido').textContent = `Status do Pedido: ${pedido.pedido.statusPedido.replace('_', ' ')}`;

        const endereco = pedido.pedido.enderecoEnvio;
        const enderecoCompleto = `${endereco.rua}, ${endereco.numero} - ${endereco.bairro} ${endereco.complemento ? `, ${endereco.complemento}` : ''}`;

        document.getElementById('endereco-pedido').textContent = `Endereço de Envio: ${enderecoCompleto}`;
        document.getElementById('frete').textContent = `Valor do Frete: R$ ${pedido.pedido.frete.toFixed(2)}`;

        const tbody = document.getElementById("table-body");
        tbody.innerHTML = ""; 

        pedido.produtos.forEach(produto => {
            const imgElement = document.createElement('img');
            imgElement.src = produto.urlImagemPrincipal || ''; 
            imgElement.style.width = "100px";

            const produtoElement = document.createElement('tr');
            produtoElement.innerHTML = 
            `
                <td>${imgElement.outerHTML}</td>
                <td>${produto.nomeProduto}</td>
                <td>${produto.quantidade}</td>
                <td>R$ ${produto.valorUnitario.toFixed(2)}</td>
                <td>R$ ${produto.total.toFixed(2)}</td>
            `;
            tbody.appendChild(produtoElement);
        });

        // Exibir o modal
        document.querySelector('.main').style.filter = 'blur(5px)';
        const modal = document.querySelector('.modal-itens-pedido').style.display = 'flex';
        
        // // Adicionar o efeito de blur no conteúdo da página
        // document.body.classList.add('modal-open');
    } else {
        console.log("Pedido não encontrado.");
    }
}

// Função para fechar o modal
document.getElementById('close-modal').addEventListener('click', function() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';

    // Remover o blur da página
    document.querySelector('.main').style.filter = '';
});
