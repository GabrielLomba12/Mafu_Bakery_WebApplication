const produtosCabecalho = document.querySelector('.box-titulos')

function exibirProdutosCarrinho() {
    const produtosCarrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const produtosMap = {};
    let valorTotal = 0;

    produtosCarrinho.forEach(produto => {
        produtosMap[produto.id] = {...produto};
    });

    const tbody = document.querySelector("tbody");
    tbody.innerHTML = "";
    for (const id in produtosMap) {
        const produto = produtosMap[id];

        const valorUnitario = parseFloat(produto.preco);
        const valorTotalProduto = valorUnitario * produto.quantidade;
        valorTotal += valorTotalProduto;

        const imgElement = document.createElement('img');
        imgElement.src = produto.imagens[0];
        imgElement.alt = `${produto.nome} imagem`;
        imgElement.style.width = "100px"; 

        
        const produtoElement = document.createElement('tr');
        produtoElement.innerHTML = 
        `
            <td>${imgElement.outerHTML}</td>
            <td>${produto.nome}</td>
            <td class = "qtd">
                <button onclick="diminuirQuantidade(${produto.id})">-</button>
                <p>${produto.quantidade}</p>
                <button onclick="aumentarQuantidade(${produto.id})">+</button>
            </td>
            <td>R$ ${valorUnitario.toFixed(2)}</td>
            <td>R$ ${valorTotalProduto.toFixed(2)}</td>

            <td>
                <button id="excluir" onclick="excluirProduto(${produto.id})">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>
        `;
        tbody.appendChild(produtoElement)
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
