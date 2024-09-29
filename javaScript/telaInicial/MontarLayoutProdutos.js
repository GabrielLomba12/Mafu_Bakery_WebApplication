// var API = "4.228.231.149"; //Setar essa variavel quando subir para a nuvem e comentar a localhost
var API = "localhost"; //Setar essa variavel quando testar local e comentar a do IP

data = [];

document.addEventListener('DOMContentLoaded', () => {
    fetchProduto();
    const filtroInput = document.getElementById('filtro-items');
    filtroInput.addEventListener('keyup', filtrarProdutos);
})

async function fetchProduto() {
    try {
        const response = await fetch(`http://${API}:8080/api/produtos/exibirTodos`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const result = await response.json();
        console.log(result);
        data = result;
        montarLayoutExibicao(data);
    } catch (error) {
        console.error('Erro ao buscar dados:', error);
    }
}

function montarLayoutExibicao(produtos) {
    const listaProdutos = document.getElementById('product-list');
    listaProdutos.innerHTML = '';

    let produtosHTML = '';

    produtos.forEach(produto => {
        if (produto.status) {
            produtosHTML += `
                <div class="col product-col">
                    <div class="card h-100">
                        <img src="${produto.imagens[0]}" class="card-img-top" alt="${produto.nome}">
                        <div class="card-body">
                            <div class="produtos-nome">
                                <h5 class="card-title">${produto.nome}</h5>
                                <hr>
                            </div>
                            <p class="card-text"><strong>R$ ${formatarCasasDecimais(produto.preco)}</strong></p>
                            <p>Avaliação: ${produto.avaliacao}</p>
                            <a href="TelaDetalheProduto.html?produtoId=${produto.id}" class="btn btn-primary">Detalhes do produto</a>
                        </div>
                    </div>
                </div>
            `;
        }
    });

    listaProdutos.innerHTML = produtosHTML;
}

function filtrarProdutos() {
    var filtro = document.getElementById('filtro-items').value.toUpperCase();

    var produtos = document.querySelectorAll("#product-list .product-col");

    produtos.forEach(produto => {
        var nomeProduto = produto.querySelector(".card-title").innerText.toUpperCase();

        if (nomeProduto.includes(filtro)) {
            produto.style.display = ""; 
        } else {
            produto.style.display = "none";
        }
    });
}

