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
        <td>${pedido.statusDescricao}</td>
        <td class="acao"><button onclick="enviarParaAlteracao(${pedido.id})" id="alterar">Alterar</button></td>`;
        tbody.appendChild(tr);
    });
}

let pedidoId; 

function enviarParaAlteracao(id) {
    pedidoId = id;
    document.getElementById('card-modal').style.display = 'block';
    document.querySelector('.main').classList.add('blur'); 

    document.getElementById('btnnao').onclick = () => {
        document.getElementById('card-modal').style.display = 'none';
        document.querySelector('.main').classList.remove('blur'); 
    };

    document.getElementById('btnsim').onclick = () => {
        const novoStatus = document.getElementById('status-select').value;
        atualizarStatusPedido(pedidoId, novoStatus);
    };
}


async function atualizarStatusPedido(id, status) {
    try {
        const response = await fetch(`http://${API}:8080/api/pedidos/atualizarStatus?id=${id}&status=${status}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            document.getElementById('card-modal').style.display = 'none';
            document.querySelector('.main').classList.remove('blur');
            fetchPedidosBOData();
        } else {
            alert('Erro ao atualizar status. Verifique os dados.');
        }
    } catch (error) {
        console.error('Erro ao atualizar status:', error);
        alert('Erro ao atualizar status. Tente novamente.');
    }
}



