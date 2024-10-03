function exibirProdutosCarrinho() {
    const produtosCarrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const produtosContainer = document.querySelector('.produtos-carrinho');
    const produtosMap = {};
    produtosContainer.innerHTML = ''; 

    let valorTotal = 0;

    produtosCarrinho.forEach(produto => {
        produtosMap[produto.id] = {...produto};
    });

    const produtosCabecalho = document.createElement('div');
    produtosCabecalho.classList.add('produto');
    produtosCabecalho.innerHTML = 
    `
    <div class="box-titulos">
        <div class="title-imagem">
            <p id="t">Produto</p>
        </div>
        <div class="title-nome">
            <p id="t">Nome</p>
        </div>
        <div class="title-qtd">
            <p id="t">Quantidade</p>
        </div>
        <div class="title-valor">
            <p id="t">Valor Unitário</p>
        </div>
        <div class="title-total">
            <p id="t">Valor Total</p>   
        </div>
    </div>
    `;
    produtosContainer.appendChild(produtosCabecalho);
    for (const id in produtosMap) {
        const produto = produtosMap[id];
        const produtoElement = document.createElement('div');
        produtoElement.classList.add('produto');

        const valorUnitario = parseFloat(produto.preco);
        const valorTotalProduto = valorUnitario * produto.quantidade;
        valorTotal += valorTotalProduto;

        const imgElement = document.createElement('img');
        imgElement.src = produto.imagens[0];
        imgElement.alt = `${produto.nome} imagem`;
        imgElement.style.width = "100px"; 

        produtoElement.innerHTML = 
        `
            <div class="box-titulos">
                <div class="title-imagem">
                    <div class="info-produto">
                        ${imgElement.outerHTML} <!-- Adiciona a imagem -->
                    </div>
                </div>
                <div class="title-nome">
                    <div class="info-nome">
                        <p>${produto.nome}</p>
                    </div>
                </div>
                <div class="title-qtd">
                    <div class="info-quantidade">
                        <button onclick="diminuirQuantidade(${produto.id})">-</button>
                        <p>${produto.quantidade}</p>
                        <button onclick="aumentarQuantidade(${produto.id})">+</button>
                    </div>
                </div>
                <div class="title-valor">
                    <div class="info-valor">
                        <p>R$ ${valorUnitario.toFixed(2)}</p>
                    </div>
                </div>
                <div class="title-total">
                    <div class="info-total">
                        <p>R$ ${valorTotalProduto.toFixed(2)}</p>
                    </div>   
                </div>
                <div class="btn-lixo">
                    <button onclick="excluirProduto(${produto.id})">Lixo</button>
                </div>
            </div> 
        `;

        produtosContainer.appendChild(produtoElement);
    }

    document.getElementById('valor-produtos').innerText = `R$ ${valorTotal.toFixed(2)}`;
    document.getElementById('valor-total-pedido').innerText = `R$ ${valorTotal.toFixed(2)}`; 
}

function aumentarQuantidade(id) {
    const produtosCarrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    let quantidade = parseInt(localStorage.getItem('quantidade')) || 0;
    const produto = produtosCarrinho.find(p => p.id == id);

    if (produto) {
        produto.quantidade += 1;
        quantidade += 1;
        localStorage.setItem('carrinho', JSON.stringify(produtosCarrinho));
        localStorage.setItem('quantidade', quantidade);
        exibirProdutosCarrinho(); // Atualiza a tela após a alteração
        atualizarCarrinho();
    } else {
        console.log('Produto não encontrado no carrinho'); 
    }
}

function diminuirQuantidade(id) {
    const produtosCarrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    let quantidade = parseInt(localStorage.getItem('quantidade')) || 0;
    const produtoIndex = produtosCarrinho.findIndex(p => p.id == id);

    if (produtoIndex !== -1) {
        const produto = produtosCarrinho[produtoIndex];

        if (produto.quantidade === 1) {
            produtosCarrinho.splice(produtoIndex, 1); // Remove o produto do array
            quantidade -= 1;
        } else {
            produto.quantidade -= 1;
            quantidade -= 1;
        }
        
        localStorage.setItem('carrinho', JSON.stringify(produtosCarrinho));
        localStorage.setItem('quantidade', quantidade);
        exibirProdutosCarrinho(); // Atualiza a tela após a alteração
        atualizarCarrinho();
    } else {
        console.log('Produto não encontrado no carrinho'); 
    }
}

function excluirProduto(id) {
    const produtosCarrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    let quantidade = parseInt(localStorage.getItem('quantidade')) || 0;
    const produtoIndex = produtosCarrinho.findIndex(p => p.id == id);

    if (produtoIndex !== -1) {
        const produto = produtosCarrinho[produtoIndex];

        produtosCarrinho.splice(produtoIndex, 1); // Remove o produto do array
        quantidade -= produto.quantidade;
        
        localStorage.setItem('carrinho', JSON.stringify(produtosCarrinho));
        localStorage.setItem('quantidade', quantidade);
        exibirProdutosCarrinho(); // Atualiza a tela após a alteração
        atualizarCarrinho();
    } else {
        console.log('Produto não encontrado no carrinho'); 
    }
}

function atualizarCarrinho() {
    const quantidadeAtual = parseInt(localStorage.getItem("quantidade")) || 0;
    document.getElementById("itens-carrinho").innerText = `[${quantidadeAtual}]`;
}

document.addEventListener('DOMContentLoaded', exibirProdutosCarrinho);
