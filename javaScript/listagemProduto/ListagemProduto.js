// var API = "4.228.231.149"; //Setar essa variavel quando subir para a nuvem e comentar a localhost
var API = "localhost"; //Setar essa variavel quando testar local e comentar a do IP

const emailUsuario = localStorage.getItem("email");
var token = localStorage.getItem("tokenAcesso");
// buscarUsuario(emailUsuario);

const linhasPagina = 10;
let paginaAtual = 1;
let paginasTotais = 0;
let data = []; // Array para armazenar os dados dos produtos

var permissao = localStorage.getItem("permissao")

async function fetchProdutoData(page = 0) {
    try {
        const response = await fetch(`http://${API}:8080/api/produtos/listagem?page=${page}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
         // Substitua pela URL do seu backend
        const result = await response.json();
        console.log(result);  // Verifique aqui se os dados estão corretos

        data = result.produtos; // Armazena os produtos recebidos
        paginasTotais = result.paginasTotais; // Armazena o número total de páginas
        displayTableData();
        setupPagination();
    } catch (error) {
        console.error('Erro ao buscar dados:', error);
    }
}

function displayTableData() {
    const tabela = document.querySelector('.divTable');

    if (permissao === "ADMINISTRADOR") {
        tabela.innerHTML = `
        <div class="tabela" id="tabela-de-usuario"> 
            <table border="1" class="estilo-tabela" id="userTable">
                <thead> 
                    <tr>       
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Estoque</th>
                        <th>Preço</th>
                        <th>Status</th>
                        <th class="acao">Alterar</th>
                        <th class="acao">Ativar/Desativar</th>
                        <th class="acao">Visualizar</th>
                    </tr>
                </thead>
                <tbody id="table-body">
                </tbody>
            </table>
        </div>
                        `;
        const tableBody = document.getElementById('table-body');
        tableBody.innerHTML = '';

        data.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.nome}</td>
            <td>${item.quantidadeEstoque}</td>
            <td>R$${formatarCasasDecimais(item.preco)}</td>
            <td>${item.status ? 'Ativo' : 'Inativo'}</td>
            <td class="acao"><button onclick="enviarParaAlteracao(${item.id})" id="alterar">Alterar</button></td>
            <td class="acao"><button id="ativar">Ativar/Desativar</button></td>
            <td class="acao"><button>Visualizar</button></td>
        `;
            tableBody.appendChild(row);
        });
    } else if (permissao === "ESTOQUISTA") {
        tabela.innerHTML = `
        <div class="tabela" id="tabela-de-usuario"> 
            <table border="1" class="estilo-tabela" id="userTable">
                <thead> 
                    <tr>       
                        <th>ID</th>
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
        </div>
        
                        `;
        const tableBody = document.getElementById('table-body');
        tableBody.innerHTML = '';
        data.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.nome}</td>
            <td>${item.quantidadeEstoque}</td>
            <td>R$${formatarCasasDecimais(item.preco)}</td>
            <td>${item.status ? 'Ativo' : 'Inativo'}</td>
            <td class="acao"><button>Alterar</button></td>
        `;
            tableBody.appendChild(row);
        });
    } else {
        alert("Você não tem permissão para acessar esta página!");
        window.location.href = 'Login.html';
    }
}

function setupPagination() {
    const paginacao = document.getElementById('paginacao');
    paginacao.innerHTML = '';

    for (let i = 1; i <= paginasTotais; i++) {
        const button = document.createElement('button');
        button.innerText = i;
        button.classList.add('page-btn');
        if (i === paginaAtual) {
            button.classList.add('active');
        }
        button.addEventListener('click', () => {
            paginaAtual = i;
            fetchProdutoData(paginaAtual - 1);
        });
        paginacao.appendChild(button);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    fetchProdutoData(); // Carrega os dados do backend quando a página é carregada
});

function formatarCasasDecimais(numero) {
    return Number(numero).toFixed(2);
}

function redirecionarCadastroProduto() {
    window.location.href = "cadastroProduto.html";
}

function enviarParaAlteracao(id) {
    window.location.href = `../cadastroProduto.html?id=${id}`
}