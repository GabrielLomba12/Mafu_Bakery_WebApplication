// var API = "4.228.231.149"; //Setar essa variavel quando subir para a nuvem e comentar a localhost
var API = "localhost"; //Setar essa variavel quando testar local e comentar a do IP

const clienteLId = localStorage.getItem("ClienteId");

document.getElementById("salvar-dados-usuario").addEventListener('click', alterarDadosCliente)

function alterarDadosCliente() {
    const clienteAlterado = {
        nomeCompleto: document.getElementById('nome-usuario').value,
        dataDeNascimento: document.getElementById('data-nascimento').value,
        genero: document.getElementById('genero').value 
    }

    fetch(`http://${API}:8080/api/cliente/alterarCliente?id=${clienteLId}`, {
        method: 'PUT',
        headers : {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(clienteAlterado)
    }) 
    .then(response => {
        if(response.ok) {
            document.querySelector('#cartao-usuario').style.display = "none";
            alert("Dados Alterados com Sucesso!");
            location.reload();
            return response.json()
        } else  
            throw new Error('Erro ao coletar dados do usuário.')
    })
}