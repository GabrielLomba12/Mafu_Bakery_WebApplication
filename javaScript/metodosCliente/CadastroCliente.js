// const clienteDTO = {
//     nomeCompleto: "João da Silva",
//     cpf: "12345678911",
//     email: "joao.silva@teste.com",
//     dataDeNascimento: "1990-01-01", 
//     genero: "Masculino",
//     senha: "senhaSegura"
// };

// const enderecosDTO = [
//     {
//         cep: "12345678",
//         rua: "Rua Exemplo",
//         bairro: "Bairro Exemplo",
//         cidade: "Cidade Exemplo",
//         numero: "123",
//         complemento: "Apt 101",
//         uf: "SP",
//         tipo: "ENTREGA",
//         principal: true
//     },
//     {
//         cep: "87654321",
//         rua: "Rua Alternativa",
//         bairro: "Outro Bairro",
//         cidade: "Outra Cidade",
//         numero: "456",
//         complemento: "",
//         uf: "RJ",
//         tipo: "FATURAMENTO",
//         principal: false
//     }
// ];

// const formData = new FormData();

// formData.append("cliente", JSON.stringify(clienteDTO));
// formData.append("enderecos", JSON.stringify(enderecosDTO));

// document.addEventListener('DOMContentLoaded', () => {
//     fetch("http://localhost:8080/api/cliente/cadastro", {
//         method: "POST",
//         body: formData,
//     })
//     .then(response => {
//         if (response.ok) {
//             console.log("Cadastro realizado!");
//         } else {
//             throw new Error('Erro ao fazer a requisição: ' + response.statusText);
//         }
//     })
//     .catch(error => {
//         console.error("Erro:", error);
//     });
// });

// var API = "4.228.231.149"; //Setar essa variavel quando subir para a nuvem e comentar a localhost
var API = "localhost"; //Setar essa variavel quando testar local e comentar a do IP

function cadastrar(formData) {
    // mostrarLoading();
    fetch(`http://`+API+`:8080/api/cliente/cadastro`, {
        method: "POST",
        body: formData,
    })
    .then(response => {
        if (response.ok) {
            esconderLoading();
            console.log("Cadastro realizado!");
        } else {
            throw new Error('Erro ao fazer a requisição: ' + response.statusText);
        }
    })
    .catch(error => {
        console.error("Erro:", error);
    });
}

document.querySelector("#form2").addEventListener("submit", function (event) {
    event.preventDefault();

    // const form = event.target;
    // if (form.checkValidity()) {
        const formData = new FormData(); // Cria um novo FormData

        const cliente ={
            nomeCompleto: document.querySelector("#nome").value,
            cpf: document.querySelector("#cpf").value,
            email: document.querySelector("#email").value,
            dataDeNascimento: document.querySelector("#data_nascimento").value,
            genero: document.querySelector("#genero").value,
            senha: document.querySelector("#senha").value
        }

        // Adicionar os dados do cliente ao FormData
        formData.append("cliente", JSON.stringify(cliente));
        console.log(cliente)

        const enderecos = [
            {
                cep: document.querySelector("#cep").value,
                rua: document.querySelector("#rua").value,
                bairro: document.querySelector("#bairro").value,
                cidade: document.querySelector("#cidade").value,
                numero: document.querySelector("#numero").value,
                complemento: document.querySelector("#complemento").value,
                uf: document.querySelector("#uf").value,
                tipo: document.querySelector("#tipo").value,
                principal: document.querySelector("#principal").checked
            },

            {
                cep: document.querySelector("#cepFat").value,
                rua: document.querySelector("#ruaFat").value,
                bairro: document.querySelector("#bairroFat").value,
                cidade: document.querySelector("#cidadeFat").value,
                numero: document.querySelector("#numeroFat").value,
                complemento: document.querySelector("#complementoFat").value,
                uf: document.querySelector("#ufFat").value,
                tipo: document.querySelector("#tipoFat").value,
                principal: false 
            }
            
        ];

        
        formData.append("enderecos", JSON.stringify(enderecos));  
        console.log(enderecos)

        // Chamar a função para cadastrar
        cadastrar(formData);
        limparCampos(); // Limpar campos após o envio
    
});

