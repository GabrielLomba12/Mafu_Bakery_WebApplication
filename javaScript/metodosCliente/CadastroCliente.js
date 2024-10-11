const clienteDTO = {
    nomeCompleto: "João da Silva",
    cpf: "12345678911",
    email: "joao.silva@teste.com",
    dataDeNascimento: "1990-01-01", 
    genero: "Masculino",
    senha: "senhaSegura"
};

const enderecosDTO = [
    {
        cep: "12345678",
        rua: "Rua Exemplo",
        bairro: "Bairro Exemplo",
        cidade: "Cidade Exemplo",
        numero: "123",
        complemento: "Apt 101",
        uf: "SP",
        tipo: "ENTREGA",
        principal: true
    },
    {
        cep: "87654321",
        rua: "Rua Alternativa",
        bairro: "Outro Bairro",
        cidade: "Outra Cidade",
        numero: "456",
        complemento: "",
        uf: "RJ",
        tipo: "FATURAMENTO",
        principal: false
    }
];

const formData = new FormData();

formData.append("cliente", JSON.stringify(clienteDTO));
formData.append("enderecos", JSON.stringify(enderecosDTO));

document.addEventListener('DOMContentLoaded', () => {
    fetch("http://localhost:8080/api/cliente/cadastro", {
        method: "POST",
        body: formData,
    })
    .then(response => {
        if (response.ok) {
            console.log("Cadastro realizado!");
        } else {
            throw new Error('Erro ao fazer a requisição: ' + response.statusText);
        }
    })
    .catch(error => {
        console.error("Erro:", error);
    });
});
