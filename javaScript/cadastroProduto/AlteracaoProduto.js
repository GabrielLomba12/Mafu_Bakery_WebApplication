// var API = "4.228.231.149"; //Setar essa variavel quando subir para a nuvem e comentar a localhost
var API = "localhost"; //Setar essa variavel quando testar local e comentar a do IP

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (productId) {
        // Modo de edição: carregar os dados do produto
        fetch(`http://${API}:8080/api/produtos/recuperaProduto?id=${productId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
        })
        .then(response => response.json())
        .then(data => preencherFormulario(data))
        .catch(error => console.error('Erro ao buscar produto:', error));
        alterarInterfaceParaEdicaoDoProduto();
    }
    
});

function preencherFormulario(data) {
    // Preencher os campos do formulário com os dados recebidos
    document.getElementById("nomeProduto").value = data.nome;
    document.getElementById("preco").value = data.preco;
    document.getElementById("avaliacao").value = data.avaliacao;
    document.getElementById("descricao").value = data.descricao;
    document.getElementById("categoria").value = data.categoria;
    document.getElementById("tamanho").value = data.tamanho;
    
    // Preenchendo ingredientes
    let dadosIngrediente = []
    const ingredienteSelect = document.getElementById("textarea-tam-est");
    ingredienteSelect.innerHTML = ''; // Limpa o campo antes de adicionar ingredientes
    data.ingredientes.forEach(ingrediente => {
        const quantidade = ingrediente.quantidade;
        const ingredienteid = ingrediente.id;
        dadosIngrediente.push({quantidade, ingredienteid});
        const texto = dadosIngrediente.map(item => `Quantidade: ${item.quantidade}, Ingrediente: ${item.ingredienteid}`).join('\n');
        ingredienteSelect.value = texto;
    });

}
    const form = document.querySelector('form');
    form.addEventListener('submit', (event) => {
        // Customizar validação
        validarFormulario(event);
    });

function alterarInterfaceParaEdicaoDoProduto() {
    document.querySelector('h2').textContent = 'Edite os dados do produto!';
}