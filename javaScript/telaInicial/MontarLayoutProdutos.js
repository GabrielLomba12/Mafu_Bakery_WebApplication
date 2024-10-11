var API = "4.228.231.149"; //Setar essa variavel quando subir para a nuvem e comentar a localhost
// var API = "localhost"; //Setar essa variavel quando testar local e comentar a do IP

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

            let produtoSemEstoque = produto.quantidadeEstoque <= 0;

            produtosHTML += `
                <div class="col product-col">
                <div class="card h-100 ${produtoSemEstoque ? 'sem-estoque' : ''}">
                    <div class="img-container">
                        <img src="${produto.imagens[0]}" class="card-img-top" alt="${produto.nome}">
                    </div>
                    <div class="card-body">
                        <div class="produtos-nome">
                            <h5 class="card-title">${produto.nome}</h5>
                            <hr class="hr-style">
                        </div>
                        <p class="card-text"><strong>R$ ${formatarCasasDecimais(produto.preco)}</strong></p>
                        <p>Avaliação: ${produto.avaliacao}</p>
                        <a href="TelaDetalheProduto.html?produtoId=${produto.id}" class="btn btn-custom det-button ${produtoSemEstoque ? 'disabled' : ''}" ${produtoSemEstoque ? 'tabindex="-1"' : ''}>Ver detalhes</a>
                        <a href="#" class="btn btn-carrinho ${produtoSemEstoque ? 'disabled' : ''}" ${produtoSemEstoque ? 'tabindex="-1"' : ''} data-id="${produto.id}">Adicionar ao Carrinho</a>
                    </div>
                </div>
                ${produtoSemEstoque ? '<div class="esgotado-overlay">ESGOTADO</div>' : ''}
            </div>
            `;
        }
    });

    listaProdutos.innerHTML = produtosHTML;

    const style = document.createElement('style');
    style.innerHTML = `
        .sem-estoque {
            filter: blur(5px);
            position: relative;
        }
        .esgotado-overlay {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 0, 0, 0.8);
            color: white;
            padding: 5px 10px;
            font-size: 18px;
            font-weight: bold;
            text-align: center;
            z-index: 1;
        }
        .det-button.disabled {
            pointer-events: none; /* Desativa qualquer interação com o botão */
            opacity: 0.6; /* Torna visualmente claro que está desativado */
        }
    `;
    document.head.appendChild(style);

    const botoesCarrinho = document.querySelectorAll('.btn-carrinho');
    botoesCarrinho.forEach(botao => {
        botao.addEventListener('click', function(event) {
            event.preventDefault();
            const produtoId = this.getAttribute('data-id');
            const produtoSelecionado = produtos.find(p => p.id == produtoId);

            if (produtoSelecionado) {
                adicionarAoCarrinho(produtoSelecionado);
                atualizarCarrinho();
            }
        });
    });
}

function adicionarAoCarrinho(produto) {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

    const produtoExistente = carrinho.find(p => p.id === produto.id);
    
    if (produtoExistente) {
        produtoExistente.quantidade += 1;
    } else {
        produto.quantidade = 1;
        carrinho.push(produto);
    }

    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    alert(`${produto.nome} foi adicionado ao carrinho!`);
}

function atualizarCarrinho() {
    let quantidadeAtual = 0;
    const produtosCarrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    produtosCarrinho.forEach(produto => {
        quantidadeAtual += produto.quantidade;
    })
    document.getElementById("itens-carrinho").innerText = `[${quantidadeAtual}]`;
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