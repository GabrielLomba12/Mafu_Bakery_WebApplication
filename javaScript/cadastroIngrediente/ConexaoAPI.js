// var API = "4.228.231.149"; //Setar essa variavel quando subir para a nuvem e comentar a localhost
var API = "localhost"; //Setar essa variavel quando testar local e comentar a do IP

var token = localStorage.getItem("tokenAcesso");
var permissao = localStorage.getItem("permissao");

document.addEventListener('DOMContentLoaded', function () {
    if(permissao === "ESTOQUISTA") {
        document.getElementById('headerA').style.display = 'none';
    }

    else if (permissao === "ADMINISTRADOR") {
        document.getElementById('novo').addEventListener('click', function () {
            localStorage.removeItem('ingredienteId');
            window.location.href = 'cadastroIngrediente.html';
        });
    }
});

// document.querySelector(".form").addEventListener("submit", validarCamposIngrediente);

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

        cadastrarIngrediente(ingrediente);
        // document.querySelector(".form").addEventListener("click", function () {
        //     removerInvalidFeedbackClass();
        // });
        limparCampos();
    }
};

function cadastrarIngrediente(ingrediente) {
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
                document.querySelector(".modal-confirm").style.display = "flex";
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