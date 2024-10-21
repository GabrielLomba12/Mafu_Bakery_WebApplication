var API = "4.228.231.149"; //Setar essa variavel quando subir para a nuvem e comentar a localhost
// var API = "localhost"; //Setar essa variavel quando testar local e comentar a do IP
var token = localStorage.getItem("tokenAcesso");
var id = localStorage.getItem("ClienteId");

document.getElementById("salvar-senha").addEventListener("click", function(event) {
    event.preventDefault();
    console.log("Clicando");
    senhas = {
        senhaAtual : document.getElementById("campo-senha-usuario").value,
        senhaNova : document.getElementById("NovaSenha-usuario").value
    }
    
    fetch(`http://${API}:8080/api/cliente/alteraSenha?id=${id}`, {
        method: "PATCH",
        body: JSON.stringify(senhas),
        headers : {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (response.ok) {
            alert("Senha Atualizada!");
            closeModalSenha();
        } else if(response.status === 400){
            alert("Senha Atual Inválida!");
        }else {
            throw new Error('Erro ao fazer a requisição: ' + response.statusText);
        }
    })
    .catch(error => {
        console.error("Erro:", error);
    })
});