// var API = "4.228.231.149"; // Setar essa variável quando subir para a nuvem e comentar a localhost
var API = "localhost"; // Setar essa variável quando testar local e comentar a do IP

let faturamentoCadastrado = false; 
let principalSelecionado = false; 

let buttonOK = document.getElementById("botaook");

function cadastrar(formData) {
    mostrarLoading();
    fetch(`http://` + API + `:8080/api/cliente/cadastro`, {
        method: "POST",
        body: formData,
    })
    .then(response => {
        if (response.ok) {
            setTimeout(() => {
                esconderLoading();
                document.getElementById("card-modal").style.display = "flex"
                document.getElementById("modal-confirm").style.display = "flex"
                console.log("Cadastro realizado!");
                buttonOK.addEventListener("click", () => {
                    window.location.href = "Login.html";
                })
                
            }, 3000);
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

    const formData = new FormData(); 

    const cliente = {
        nomeCompleto: document.querySelector("#nome").value,
        cpf: document.querySelector("#cpf").value,
        email: document.querySelector("#email").value,
        dataDeNascimento: document.querySelector("#data_nascimento").value,
        genero: document.querySelector("#genero").value,
        senha: document.querySelector("#senha").value
    };

    formData.append("cliente", JSON.stringify(cliente));
    console.log(cliente);

    const enderecosText = document.getElementById('enderecosAdicionados').value;
    const enderecos = processarEnderecos(enderecosText);

    const temFaturamento = enderecos.some(endereco => endereco.tipo === 'FATURAMENTO');
    const temEntrega = enderecos.some(endereco => endereco.tipo === 'ENTREGA');

    if (!temFaturamento || !temEntrega) {
        alert('É necessário cadastrar pelo menos um endereço de FATURAMENTO e um de ENTREGA.');
        return; // Interrompe o envio se a validação falhar
    }

    formData.append("enderecos", JSON.stringify(enderecos));
    console.log(enderecos);

    cadastrar(formData);
    limparCampos(); 
});

// Função para processar o texto do textarea e converter em um array de objetos de endereço
function processarEnderecos(enderecosText) {
    const enderecosArray = enderecosText.trim().split('\n\n'); 
    const enderecos = enderecosArray.map(enderecoText => {
        const partes = enderecoText.split(',').map(p => p.trim());

        return {
            cep: partes[0]?.split(': ')[1] || '',
            rua: partes[1]?.split(': ')[1] || '',
            bairro: partes[2]?.split(': ')[1] || '',
            cidade: partes[3]?.split(': ')[1] || '',
            numero: partes[4]?.split(': ')[1] || '',
            complemento: partes[5]?.split(': ')[1] || '',
            uf: partes[6]?.split(': ')[1] || '',
            tipo: partes[7]?.split(': ')[1] || '',
            principal: partes[8]?.split(': ')[1] === 'true'
        };
    });

    return enderecos;
}

function adicionarEndereco() {
    const cep = document.getElementById('cep').value;
    const rua = document.getElementById('rua').value;
    const bairro = document.getElementById('bairro').value;
    const cidade = document.getElementById('cidade').value;
    const numero = document.getElementById('numero').value;
    const complemento = document.getElementById('complemento').value;
    const uf = document.getElementById('uf').value;
    const tipo = document.getElementById('tipo').value;
    const principal = document.getElementById('principal').checked;

    if (cep.trim() === '' || rua.trim() === '' || bairro.trim() === '' || cidade.trim() === '' || numero.trim() === '' || uf.trim() === '') {
        alert('Por favor, preencha todos os campos antes de adicionar o endereço.');
        return;
    }

    // Verifica se já existe um endereço de FATURAMENTO
    if (tipo === 'FATURAMENTO' && faturamentoCadastrado) {
        alert('Só é permitido cadastrar um endereço de FATURAMENTO.');
        return;
    }

    // Verifica se já existe um endereço principal
    if (principal && principalSelecionado) {
        alert('Só é permitido cadastrar um endereço como principal.');
        return;
    }

    if (tipo === 'FATURAMENTO' && principal) {
        alert('Não é possível cadastrar um endereço de faturamento como principal.');
        return; // Interrompe a adição do endereço
    }
    
    if (tipo === 'FATURAMENTO') faturamentoCadastrado = true;
    if (principal) {
        principalSelecionado = true;
        document.getElementById('principal').disabled = true; // Desabilita checkbox principal
    }

    const enderecosAdicionados = document.getElementById('enderecosAdicionados');
    enderecosAdicionados.value += `CEP: ${cep}, Rua: ${rua}, Bairro: ${bairro}, Cidade: ${cidade}, Número: ${numero}, Complemento: ${complemento}, UF: ${uf}, Tipo: ${tipo}, Principal: ${principal}\n\n`;
}

// function copiarEnderecoFaturamento() {
//     const enderecosText = document.getElementById('enderecosAdicionados').value;
//     const enderecos = processarEnderecos(enderecosText);
    
//     const enderecoFaturamento = enderecos.find(endereco => endereco.tipo === 'FATURAMENTO');
//     if (enderecoFaturamento) {
//         document.getElementById('cep').value = enderecoFaturamento.cep;
//         document.getElementById('rua').value = enderecoFaturamento.rua;
//         document.getElementById('bairro').value = enderecoFaturamento.bairro;
//         document.getElementById('cidade').value = enderecoFaturamento.cidade;
//         document.getElementById('numero').value = enderecoFaturamento.numero;
//         document.getElementById('complemento').value = enderecoFaturamento.complemento;
//         document.getElementById('uf').value = enderecoFaturamento.uf;
//         document.getElementById('tipo').value = 'ENTREGA'; // Define como endereço de entrega
//     } else {
//         alert('Não existe um endereço de FATURAMENTO para copiar.');
//     }
// }

document.querySelector("#limparCampos").addEventListener('click', function(){
    document.getElementById('cep').value = '';
    document.getElementById('rua').value = '';
    document.getElementById('bairro').value = '';
    document.getElementById('cidade').value = '';
    document.getElementById('numero').value = '';
    document.getElementById('complemento').value = '';
    document.getElementById('uf').value = '';
    document.getElementById('tipo').value = 'FATURAMENTO';
    document.getElementById('principal').checked = false;
});
