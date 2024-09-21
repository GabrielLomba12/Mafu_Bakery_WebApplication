// var API = "4.228.231.149"; //Setar essa variavel quando subir para a nuvem e comentar a localhost
var API = "localhost"; //Setar essa variavel quando testar local e comentar a do IP

var token = localStorage.getItem("tokenAcesso");

document.addEventListener('DOMContentLoaded', () => {
    const ingrediente = localStorage.getItem("ingredienteId")
    if(ingrediente) {
        carregarDadosIngrediente(ingrediente);
    }

});

async function carregarDadosIngrediente(id) {
    await fetch(`http://${API}:8080/api/mp/mpPorId?id=${id}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => preencherFormulario(data))
    .catch(error => console.error('Erro ao buscar ingrediente:', error));
    alterarInterfaceParaEdicaoDoIngrediente();
    
}

function preencherFormulario(data) {
    document.getElementById('nomeIngrediente').value = data.nome;
    document.getElementById('descricao').value = data.descricao;
    document.getElementById('preco').value = data.preco;
    document.getElementById('estoque').value = data.quantidadeEstoque;
    document.getElementById('unidadeMedida').value = data.unidadeMedida;
}

function alterarInterfaceParaEdicaoDoIngrediente() {
    document.querySelector('h2').textContent = 'Edite os dados do ingrediente!';
}