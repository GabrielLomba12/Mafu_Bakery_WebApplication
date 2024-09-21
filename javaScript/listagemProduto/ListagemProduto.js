// var API = "4.228.231.149"; //Setar essa variavel quando subir para a nuvem e comentar a localhost
var API = "localhost"; //Setar essa variavel quando testar local e comentar a do IP

const emailUsuario = localStorage.getItem("email");
var token = localStorage.getItem("tokenAcesso");

const linhasPagina = 10;
let paginaAtual = 1;
let paginasTotais = 0;
let data = [];

var permissao = localStorage.getItem("permissao")

async function fetchProdutoData(page = 0) {
    try {
        const response = await fetch(`http://${API}:8080/api/produtos/listagem?page=${page}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const result = await response.json();
        console.log(result); 

        data = result.produtos;
        paginasTotais = result.totalPages; 
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
            <td class="acao">
            <label class="switch">
                <input type="checkbox" id="toggle-btn-${item.id}" ${item.status ? 'checked' : ''} 
                onclick="exibirModalProduto(${item.id}, this.checked)">
                <span class="slider"></span>
            </label>
            </td>
            <td class="acao"><button id="preview" onclick="fetchPreviewProduto(${item.id})">Visualizar</button></td>
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
            <td class="acao"><button onclick="enviarParaAlteracao(${item.id})">Alterar</button></td>
        `;
            tableBody.appendChild(row);
        });
    } else {
        alert("Você não tem permissão para acessar esta página!");
        window.location.href = 'Login.html';
    }
}

let selectedProdutoId = null; 
let selectedToggleStatus = null;

function exibirModalProduto(produtoId, statusProduto) {
    selectedProdutoId = produtoId; 
    selectedToggleStatus = statusProduto; 

    document.querySelector("#card-modal").style.display = "flex";

    document.querySelector("#btnsim").onclick = function() {
        alterarStatusProduto(selectedProdutoId, selectedToggleStatus);
    };
    document.querySelector("#btnnao").onclick = function() {
        fecharModalProduto(); 
        const toggle = document.querySelector(`#toggle-btn-${selectedProdutoId}`);
        toggle.checked = !selectedToggleStatus;
    };
}

function setupPagination() {
    const paginacao = document.getElementById('pagination');
    if (!paginacao) {
        console.error("Elemento de paginação não encontrado!");
        return;
    }

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

function alterarStatusProduto(produtoId, status) {
    fetch(`http://${API}:8080/api/produtos/statusProduto?id=${produtoId}&status=${status}`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            fetchProdutoData(paginaAtual - 1);
            fecharModalProduto();
        } else {
            alert('Falha ao alterar o status do produto.');
        }
    })
    .catch(error => {
        console.error('Erro na requisição:', error);
        alert('Ocorreu um erro ao tentar alterar o status do produto.');
        fecharModalProduto(); 
    });
}

function previewProduto(id) {
    localStorage.setItem("produtoId", id)
}

document.addEventListener('DOMContentLoaded', () => {
    fetchProdutoData(); 
});

let imagemAtual = 0;

function fetchPreviewProduto(id) {
    fetch(`http://${API}:8080/api/produtos/exibicao?id=${id}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        exibirModal();
        console.log(response);
        if (response.ok) {
            return response.json();
        } else {
            alert("Não foi possível acessar o preview do produto!");
        }
    })
    .then(data => {
        divPreview.innerHTML = '';

        const divInformacoes = document.createElement('div');
        const divImagens = document.createElement('div');

        divInformacoes.classList.add('div-informacoes');
        divImagens.classList.add('div-imagens');
        
        let imagens = data.imagens;

        function mostrarImagem(index) {
            divImagens.innerHTML = ''; 

            const imgElement = document.createElement('img');
            imgElement.src = imagens[index];
            imgElement.alt = `${data.nome} imagem`;
            imgElement.style.width = "400px";
            imgElement.classList.add('img-carousel');
            divImagens.appendChild(imgElement);

            const prevButton = document.createElement('button');
            prevButton.id = 'prev-button';
            prevButton.innerText = '◀';
            prevButton.onclick = () => {
                imagemAtual = (imagemAtual > 0) ? imagemAtual - 1 : imagens.length - 1;
                mostrarImagem(imagemAtual);
            };

            const nextButton = document.createElement('button');
            nextButton.id = 'next-button';
            nextButton.innerText = '▶';
            nextButton.onclick = () => {
                imagemAtual = (imagemAtual < imagens.length - 1) ? imagemAtual + 1 : 0;
                mostrarImagem(imagemAtual);
            };

            divImagens.appendChild(prevButton);
            divImagens.appendChild(nextButton);
        }

        mostrarImagem(imagemAtual);

        divPreview.appendChild(divImagens);

        divInformacoes.innerHTML = `
            <button class="close-btn" onclick="fecharModal()">X</button>
            <p>${data.nome}</p>
            <p>${data.descricao}</p>
            <p>Avaliação: ${data.avaliacao}</p>
            <p>R$ ${data.preco}</p>
        `;
        divPreview.appendChild(divInformacoes);

    })
    .catch(error => {
        console.error("Erro ao buscar preview do produto:", error);
        alert("Ocorreu um erro ao acessar o preview do produto.");
    });
}


