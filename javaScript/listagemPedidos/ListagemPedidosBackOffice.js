// var API = "4.228.231.149"; //Setar essa variavel quando subir para a nuvem e comentar a localhost
var API = "localhost"; //Setar essa variavel quando testar local e comentar a do IP

const emailUsuario = localStorage.getItem("email");
var token = localStorage.getItem("tokenAcesso");
var permissao = localStorage.getItem("permissao")

document.addEventListener('DOMContentLoaded', () => {
    fetchPedidosBOData();
});

async function fetchPedidosBOData() {
    try {
        const response = await fetch(`http://${API}:8080/api/pedidos/listarPedidosBackOffice`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        const pedidos = await response.json();
        preencherTabela(pedidos);
    } catch (error) {
        console.error("Erro ao buscar pedidos:", error);
    }
} 

function preencherTabela(pedidos) {
    const tabela = document.querySelector('.divTable');

        tabela.innerHTML = `
        <div class="tabela" id="tabela-de-pedidos"> 
            <table border="1" class="estilo-tabela" id="userTable">
                <thead> 
                    <tr>       
                        <th>Data do Pedido</th>
                        <th>Nº Pedido</th>
                        <th>Valor Total</th>
                        <th>Status</th>
                        <th class="acao">Alterar Status</th>
                    </tr>
                </thead>
                <tbody id="table-body">
                </tbody>
            </table>
        </div>`;

    const tbody = document.querySelector("tbody");
    tbody.innerHTML = "";

    pedidos.forEach(pedido => {
        
        const tr = document.createElement("tr");
        tr.innerHTML = `
        <td>${pedido.dataPedido}</td>
        <td>${pedido.id}</td>
        <td>${pedido.totalPedido}</td>
        <td>${pedido.statusPedido}</td>
        <td class="acao"><button onclick="enviarParaAlteracao(${pedido.id})" id="alterar">Alterar</button></td>`;
        tbody.appendChild(tr);
    });
}

function enviarParaAlteracao(id) {}