// var API = "4.228.231.149"; //Setar essa variavel quando subir para a nuvem e comentar a localhost
var API = "localhost"; //Setar essa variavel quando testar local e comentar a do IP
var token = localStorage.getItem("tokenAcesso");

async function cadastrarIngrediente() {
    const ingrediente = {
        nome: document.getElementById('nomeIngrediente').value,
        descricao: document.getElementById('descricao').value,
        preco: document.getElementById('preco').value,
        quantidadeEstoque: document.getElementById('estoque').value,
        unidadeMedida: document.getElementById('unidadeMedida').value,
    }

    await fetch(`http://${API}:8080/api/mp`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(ingrediente)
    })
    .then(async response => {
        if (response.ok) {
            alert("Ingrediente cadastrado com sucesso!");
            limparFormulario();
            window.location.href = "TelaBackOffice.html";
        } else {
            const errorData = await response.json();
            throw new Error("Erro ao cadastrar o ingrediente: " + errorData.message);
        }
    })
    .catch(error => {
        console.error("Erro ao cadastrar o ingrediente:", error);
        alert("Erro ao cadastrar o ingrediente: " + error.message);
    });
}

document.querySelector("#colorBtn").addEventListener("click", function (event) {
    event.preventDefault();
    cadastrarIngrediente();
});

function limparFormulario(){
    document.getElementById('nomeIngrediente').value = '';
    document.getElementById('descricao').value = '';
    document.getElementById('preco').value = '';
    document.getElementById('estoque').value = '';
    document.getElementById('unidadeMedida').value = '-';
}