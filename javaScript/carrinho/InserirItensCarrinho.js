function exibirProdutosCarrinho() {
    const produtosCarrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const produtosContainer = document.querySelector('.produtos-carrinho');
    produtosContainer.innerHTML = ''; 

    const produtosMap = {}; 
    let valorTotal = 0;

    produtosCarrinho.forEach(produto => {
        if (produtosMap[produto.id]) {
            produtosMap[produto.id].quantidade += 1;
        } else {
            produtosMap[produto.id] = {
                ...produto,
                quantidade: 1 
            };
        }
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
                        <p>${produto.quantidade}</p>
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
            </div> 
                    
        `;

        produtosContainer.appendChild(produtoElement);
    }

    document.getElementById('valor-produtos').innerText = `R$ ${valorTotal.toFixed(2)}`;
    document.getElementById('valor-total-pedido').innerText = `R$ ${valorTotal.toFixed(2)}`; 
}

document.addEventListener('DOMContentLoaded', exibirProdutosCarrinho);
