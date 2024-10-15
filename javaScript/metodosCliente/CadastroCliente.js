// var API = "4.228.231.149"; //Setar essa variavel quando subir para a nuvem e comentar a localhost
var API = "localhost"; //Setar essa variavel quando testar local e comentar a do IP

function cadastrar(formData) {
    // mostrarLoading();
    fetch(`http://` + API + `:8080/api/cliente/cadastro`, {
        method: "POST",
        body: formData,
    })
    .then(response => {
        if (response.ok) {
            // esconderLoading();
            console.log("Cadastro realizado!");
            window.location.href = "TelaLogin.html";
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

    const formData = new FormData(); // Cria um novo FormData

    const cliente = {
        nomeCompleto: document.querySelector("#nome").value,
        cpf: document.querySelector("#cpf").value,
        email: document.querySelector("#email").value,
        dataDeNascimento: document.querySelector("#data_nascimento").value,
        genero: document.querySelector("#genero").value,
        senha: document.querySelector("#senha").value
    };

    // Adicionar os dados do cliente ao FormData
    formData.append("cliente", JSON.stringify(cliente));
    console.log(cliente);

    // Obtém o texto do textarea
    const enderecosText = document.getElementById('enderecosAdicionados').value;
    const enderecos = processarEnderecos(enderecosText); // Converte o texto em um array de endereços

    // Adicionar os endereços processados ao FormData
    formData.append("enderecos", JSON.stringify(enderecos));
    console.log(enderecos);

    // Chamar a função para cadastrar
    cadastrar(formData);
    limparCampos(); // Limpar campos após o envio
});

// Função para processar o texto do textarea e converter em um array de objetos de endereço
function processarEnderecos(enderecosText) {
    const enderecosArray = enderecosText.trim().split('\n\n'); // Divide as entradas por duas quebras de linha
    const enderecos = enderecosArray.map(enderecoText => {
        const partes = enderecoText.split(',').map(p => p.trim()); // Divide cada linha por vírgula e remove espaços

        // Cria um objeto para cada endereço, assumindo que a ordem das partes é conhecida
        return {
            cep: partes[0]?.split(': ')[1] || '',
            rua: partes[1]?.split(': ')[1] || '',
            bairro: partes[2]?.split(': ')[1] || '',
            cidade: partes[3]?.split(': ')[1] || '',
            numero: partes[4]?.split(': ')[1] || '',
            complemento: partes[5]?.split(': ')[1] || '',
            uf: partes[6]?.split(': ')[1] || '',
            tipo: partes[7]?.split(': ')[1] || '',
            principal: partes[8]?.split(': ')[1] === 'true' // Ajuste se necessário
        };
    });

    return enderecos;
}

function adicionarEndereco() {
    // Obtém os valores dos inputs
    const cep = document.getElementById('cep').value;
    const rua = document.getElementById('rua').value;
    const bairro = document.getElementById('bairro').value;
    const cidade = document.getElementById('cidade').value;
    const numero = document.getElementById('numero').value;
    const complemento = document.getElementById('complemento').value;
    const uf = document.getElementById('uf').value;
    const tipo = document.getElementById('tipo').value;
    const principal = document.getElementById('principal').checked

    // Verifica se os campos necessários estão preenchidos
    if (cep.trim() === '' || rua.trim() === '' || bairro.trim() === '' || cidade.trim() === '' || numero.trim() === '' || uf.trim() === '') {
        alert('Por favor, preencha todos os campos antes de adicionar o endereço.');
        return;
    }

    // Obtém o textarea e adiciona o novo endereço
    const enderecosAdicionados = document.getElementById('enderecosAdicionados');
    enderecosAdicionados.value += `CEP: ${cep}, Rua: ${rua}, Bairro: ${bairro}, Cidade: ${cidade}, Número: ${numero}, Complemento: ${complemento}, UF: ${uf}, Tipo: ${tipo}, Principal: ${principal}\n\n`;

}

document.querySelector("#limparCampos").addEventListener('click', function(){
    // Limpa os campos de input
    document.getElementById('cep').value = '';
    document.getElementById('rua').value = '';
    document.getElementById('bairro').value = '';
    document.getElementById('cidade').value = '';
    document.getElementById('numero').value = '';
    document.getElementById('complemento').value = '';
    document.getElementById('uf').value = '';
    document.getElementById('tipo').value = 'FATURAMENTO';
})