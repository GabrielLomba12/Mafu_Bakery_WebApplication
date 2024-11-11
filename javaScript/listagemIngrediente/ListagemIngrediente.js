var API = "4.228.231.149"; //Setar essa variavel quando subir para a nuvem e comentar a localhost
// var API = "localhost"; //Setar essa variavel quando testar local e comentar a do IP

const emailUsuario = localStorage.getItem("email");
var token = localStorage.getItem("tokenAcesso");
var permissao = localStorage.getItem("permissao")
let selectedIngredienteId = null; 
let selectedToggleStats = null; 

document.addEventListener('DOMContentLoaded', () => {
    fetchIngredienteData();
    if(permissao === "ESTOQUISTA") {
        document.getElementById('headerA').style.display = 'none';
    }
    else if (permissao === "ADMINISTRADOR") {
            document.getElementById('novo').addEventListener('click', function () {
            localStorage.removeItem('ingredienteId');
            window.location.href = 'cadastroIngrediente.html';
        });
    }
});

async function fetchIngredienteData() {
    try {
        const response = await fetch(`http://${API}:8080/api/mp`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        const ingredientes = await response.json();
        preencherTabela(ingredientes);
    } catch (error) {
        console.error("Erro ao buscar ingredientes:", error);
    }
}
function preencherTabela(ingredientes) {
    const tabela = document.querySelector('.divTable');

    if(permissao === "ADMINISTRADOR") {
        tabela.innerHTML = `
        <div class="tabela" id="tabela-de-usuario"> 
            <table border="1" class="estilo-tabela" id="userTable">
                <thead> 
                    <tr>       
                        <th>Nome</th>
                        <th>Estoque</th>
                        <th>Preço</th>
                        <th>Status</th>
                        <th class="acao">Alterar</th>
                        <th class="acao">Ativar/Desativar</th>
                    </tr>
                </thead>
                <tbody id="table-body">
                </tbody>
            </table>
        </div>`;

        const tbody = document.querySelector("tbody");
        tbody.innerHTML = "";

        ingredientes.forEach(ingrediente => {
            
            const tr = document.createElement("tr");
            tr.innerHTML = 
            `<td>${ingrediente.nome}</td>
            <td>${ingrediente.quantidadeEstoque + " " + ingrediente.unidadeMedida}</td>
            <td>R$ ${formatarCasasDecimais(ingrediente.preco)}</td>
            <td>${ingrediente.status ? 'Ativo' : 'Inativo'}</td>
            <td class="acao"><button onclick="enviarParaAlteracao(${ingrediente.id})" id="alterar">Alterar</button></td>
            <td class="acao">
                <label class="switch">
                    <input type="checkbox" id="toggle-btn-${ingrediente.id}" ${ingrediente.status ? 'checked' : ''} 
                    onclick="exibirModalIngrediente(${ingrediente.id}, this.checked)">
                    <span class="slider"></span>
                </label>
            </td>`;
            tbody.appendChild(tr);
        });
    } else if(permissao === "ESTOQUISTA") {
        tabela.innerHTML = `
        <div class="tabela" id="tabela-de-usuario"> 
            <table border="1" class="estilo-tabela" id="userTable">
                <thead> 
                    <tr>       
                        <th>Nome</th>
                        <th>Estoque</th>
                        <th>Preço</th>
                        <th>Status</th>
                        <th class="acao">Alterar</th>
                    </tr>
                </thead>
                <tbody id="table-body">
                </tbody>
            </table>
        </div>`;

        const tbody = document.querySelector("tbody");
        tbody.innerHTML = "";

        ingredientes.forEach(ingrediente => {
            
            const tr = document.createElement("tr");
            tr.innerHTML = 
            `<td>${ingrediente.nome}</td>
            <td>${ingrediente.quantidadeEstoque + " " +ingrediente.unidadeMedida}</td>
            <td>R$ ${formatarCasasDecimais(ingrediente.preco)}</td>
            <td>${ingrediente.status ? 'Ativo' : 'Inativo'}</td>
            <td class="acao"><button onclick="enviarParaAlteracao(${ingrediente.id})" id="alterar">Alterar</button></td>
            `;
            tbody.appendChild(tr);
        }); 
    }
};
function alterarStatusIngrediente(ingredienteId, status) {
    fetch(`http://${API}:8080/api/mp/statusMp?id=${ingredienteId}&status=${status}`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            fetchIngredienteData();
            fecharModalIngrediente();
        } else {
            alert('Falha ao alterar o status do ingrediente.');
        }
    })
    .catch(error => {
        console.error('Erro na requisição:', error);
        alert('Ocorreu um erro ao tentar alterar o status do ingrediente.');
        fecharModalIngrediente(); 
    });
}

function exibirModalIngrediente(ingredienteId, ingredienteStatus) {
    selectedIngredienteId = ingredienteId; 
    selectedToggleStats = ingredienteStatus; 

    document.querySelector("#card-modal").style.display = "flex";

    document.querySelector("#btnsim").onclick = function() {
        alterarStatusIngrediente(selectedIngredienteId, selectedToggleStats);
    };
    document.querySelector("#btnnao").onclick = function() {
        fecharModalIngrediente(); 
        const toggle = document.querySelector(`#toggle-btn-${selectedIngredienteId}`);
        toggle.checked = !selectedToggleStats;
    };
}

function fecharModalIngrediente() {
    document.querySelector("#card-modal").style.display = "none";
}

function enviarParaAlteracao(id) {
    localStorage.setItem('ingredienteId', id)
    window.location.href = `../cadastroIngrediente.html?id=${id}`
}

function redirecionarCadastroIngrediente() {
    window.location.href = "cadastroIngrediente.html";
}

function formatarCasasDecimais(numero) {
    return Number(numero).toFixed(2);
}