function exibirResumoPedido() {
    const resumoPedido = JSON.parse(localStorage.getItem('resumoPedido'));
    const enderecoSelecionado = JSON.parse(localStorage.getItem('enderecoSelecionado'));
    const formaPagamento = localStorage.getItem('metodoPagamento');

    if (resumoPedido) {
        const produtosResumoTbody = document.getElementById('produtos-resumo');
        resumoPedido.produtos.forEach(produto => {
            const valorUnitario = parseFloat(produto.preco);
            const valorTotalProduto = valorUnitario * produto.quantidade;

            const produtoRow = document.createElement('tr');
            produtoRow.innerHTML = `
                <td><img src="${produto.imagens[0]}" alt="${produto.nome}" style="width: 50px;"></td>
                <td>${produto.nome}</td>
                <td>${produto.quantidade}</td>
                <td>R$ ${valorUnitario.toFixed(2)}</td>
                <td>R$ ${valorTotalProduto.toFixed(2)}</td>
            `;
            produtosResumoTbody.appendChild(produtoRow);
        });

        document.getElementById('valor-produtos').innerText = `R$ ${resumoPedido.valorProdutos.toFixed(2)}`;
        document.getElementById('valor-frete').innerText = `R$ ${resumoPedido.valorFrete.toFixed(2)}`;
        document.getElementById('valor-total').innerText = `R$ ${resumoPedido.valorTotalPedido.toFixed(2)}`;
    }

    if (enderecoSelecionado) {
        document.getElementById('endereco-resumo').innerText = `${enderecoSelecionado.descricao}`;
    }

    if (formaPagamento) {
        document.getElementById('forma-pagamento').innerText = formaPagamento.toUpperCase();
    }
}

document.addEventListener('DOMContentLoaded', exibirResumoPedido);

document.getElementById('btn-voltar').addEventListener('click', function() {
    window.history.back();
});