// var API = "4.228.231.149"; //Setar essa variavel quando subir para a nuvem e comentar a localhost
var API = "localhost"; //Setar essa variavel quando testar local e comentar a do IP

var token = localStorage.getItem("tokenAcesso");
var permissao = localStorage.getItem("permissao");

document.querySelector(".form").addEventListener("submit", validarCamposIngrediente);

function validarCamposIngrediente(event) {
    event.preventDefault();

    const form = event.target;
    if (form.checkValidity()) {
        const ingrediente = {
            nome: document.getElementById('nomeIngrediente').value,
            descricao: document.getElementById('descricao').value,
            preco: parseFloat(document.getElementById('preco').value),
            quantidadeEstoque: parseFloat(document.getElementById('estoque').value),
            unidadeMedida: document.getElementById('unidadeMedida').value,
        };

        cadastrarIngrediente(ingrediente, event);
        // document.querySelector(".form").addEventListener("click", function () {
        //     removerInvalidFeedbackClass();
        // });
    }
};

function cadastrarIngrediente(ingrediente, event) {
    event.preventDefault();
    mostrarLoading();

    fetch(`http://${API}:8080/api/mp`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(ingrediente)
    })
    .then(response => {
        if (response.status === 201) {
            setTimeout(() => {
                esconderLoading();
                document.getElementById("card-modal").style.display = "flex";
                limparFormulario();
            }, 3000);
        } else {
            const errorData = response.json(); 
            throw new Error("Erro ao cadastrar o ingrediente: " + errorData.message);
        }
    })
    .catch(error => {
        console.error("Erro ao cadastrar o ingrediente:", error);
        esconderLoading();
        document.querySelector(".main").classList.remove('blur');
    });
}

function limparFormulario(){
    document.getElementById('nomeIngrediente').value = '';
    document.getElementById('descricao').value = '';
    document.getElementById('preco').value = '';
    document.getElementById('estoque').value = '';
    document.getElementById('unidadeMedida').value = '-';
}