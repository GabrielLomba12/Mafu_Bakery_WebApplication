// var API = "4.228.231.149"; //Setar essa variavel quando subir para a nuvem e comentar a localhost
var API = "localhost"; //Setar essa variavel quando testar local e comentar a do IP

document.addEventListener("DOMContentLoaded", listarIngredientes(),{})

function listarIngredientes() {
    let listaIngredientes = [];
    fetch(`http://`+API+`:8080/api/mp`, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Erro ao acessar a API: " + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            listaIngredientes = data;
            const selectIngrediente = document.getElementById("ingrediente");
            selectIngrediente.innerHTML = "";

            const opcaoPadrao = document.createElement("option");
            opcaoPadrao.value = "";
            opcaoPadrao.text = "-";
            opcaoPadrao.selected = true;
            selectIngrediente.appendChild(opcaoPadrao);

            data.forEach(ingrediente => {
                const option = document.createElement("option");
                option.value = JSON.stringify(ingrediente); 
                option.text = `${ingrediente.id} - ${ingrediente.nome}`;
                selectIngrediente.appendChild(option);
            });
        })
        .catch(error => {
            console.log("Erro: " + error);
        })
    }