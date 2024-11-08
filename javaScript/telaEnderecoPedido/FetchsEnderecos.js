// var API = "4.228.231.149"; //Setar essa variavel quando subir para a nuvem e comentar a localhost
var API = "localhost"; //Setar essa variavel quando testar local e comentar a do IP

const id = localStorage.getItem("ClienteId");
const frete = localStorage.getItem('valorFrete')

document.addEventListener('DOMContentLoaded', () => {
    fetchEnderecosDeEntrega(id);
    const resumoPedido = JSON.parse(localStorage.getItem('resumoPedido'));
    console.log(resumoPedido);
});

document.getElementById('frete').innerText = "Frete: " + frete;

const modalEndereco = document.querySelector('#cartao-endereco');

function abrirModal() {
    const modalEndereco = document.querySelector('#cartao-endereco');
    modalEndereco.style.display = 'flex';
    document.querySelector('#salvar-endereco').addEventListener('click', function () {
        cadastrarNovoEndereco(id);
        modalEndereco.style.display = 'none';
        mostrarLoading();
    });
}

function limparCampos() {
    document.querySelectorAll(".input-dados").forEach(input => {
        input.value = "";
    });
}

const closeBtn = document.querySelector('.close').addEventListener('click', () => {
    closeModalEndereco();
});

const cancelarBtn = document.querySelector('.cancelar').addEventListener('click', () => {
    closeModalEndereco();
});

const closeModalEndereco = () => {
    modalEndereco.style.display = 'none';
    limparCampos()
};

function fetchEnderecosDeEntrega(id) {
    fetch(`http://${API}:8080/api/endereco/enderecosEntrega?id=${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if(!response.ok) {
            throw new Error("Erro ao acessar a API: " + response.statusText);
        } else {
            return response.json();
        }
    })
    .then(data => {
        const dropdown = document.getElementById('enderecos-cadastrados');
        dropdown.innerHTML = '<option value="">Selecione um endereço</option>';

        let principalId = null;

        if (data.length > 0) {
            data.forEach(endereco => {
                const option = document.createElement('option');
                option.value = endereco.id;
                option.textContent = `${endereco.rua}, ${endereco.numero} - ${endereco.bairro}, ${endereco.cidade}, ${endereco.uf} - ${endereco.cep}`;

                if (endereco.principal === true) {
                    principalId = endereco.id;
                }

                dropdown.appendChild(option);
            });

            if (principalId) {
                dropdown.value = principalId;
            }
        } 
        else {
            const option = document.createElement('option');
            option.value = '';
            option.textContent = 'Nenhum endereço encontrado';
            dropdown.appendChild(option);
        }
    })
    .catch(error => {
        console.error('Erro ao carregar endereços:', error);
    });
}

function cadastrarNovoEndereco(id) {
    const isPrincipal = document.getElementById('set-principal').checked;

    const endereco = {
        cep: document.getElementById('cep').value,
        rua: document.getElementById('rua').value,
        numero: document.getElementById('numero').value,
        complemento: document.getElementById('complemento').value,
        bairro: document.getElementById('bairro').value,
        cidade: document.getElementById('cidade').value,
        uf: document.getElementById('uf').value,
        tipo: document.getElementById('opcoes').value,
        principal: isPrincipal
    };

    const btnSalvar = document.getElementById('salvar-endereco');
    btnSalvar.disabled = true; 

    fetch(`http://${API}:8080/api/endereco/cadastrar?id=${id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(endereco)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Erro ao acessar a API: " + response.statusText);
        }
        else{
            alert("Endereço cadastrado com sucesso!");
            return response.json();
        }
    })
    .catch(error => {
        console.log("Erro: " + error);
    })
    .finally(() => {
        btnSalvar.disabled = false;
        location.reload();
    });
}

document.getElementById('cep').addEventListener('blur', function() {
    let cep = document.getElementById('cep').value.replace(/\D/g, ''); 
    if (cep.length === 8) {
        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then(response => response.json())
            .then(data => {
                if (!data.erro) {
                    document.getElementById('rua').value = data.logradouro;
                    document.getElementById('bairro').value = data.bairro;
                    document.getElementById('cidade').value = data.localidade;
                    document.getElementById('uf').value = data.uf;
                } else {
                    document.getElementById('rua').value = "CEP não encontrado!";
                    limparCampos();
                }
            })
            .catch(error => console.error('Erro ao consultar o CEP:', error));
    } else {
        document.getElementById('rua').value = "CEP inválido!";
        limparCampos();
    }
});

function validarEnderecoSelecionado() {
    const dropdown = document.getElementById('enderecos-cadastrados');
    const selectedValue = dropdown.value;

    if (selectedValue === '') {
        alert('Por favor, selecione um endereço.');
        return false;
    }

    console.log('Endereço selecionado:', selectedValue);
    return true;
}

document.getElementById('seguir-checkout').addEventListener('click', function() {
    const enderecoValido = validarEnderecoSelecionado();
    if (enderecoValido) {
        const dropdown = document.getElementById('enderecos-cadastrados');
        const selectedOption = dropdown.options[dropdown.selectedIndex];

        const enderecoSelecionado = {
            id: selectedOption.value,
            descricao: selectedOption.textContent
        };

        localStorage.setItem('enderecoSelecionado', JSON.stringify(enderecoSelecionado));
        console.log('Endereço salvo no localStorage:', enderecoSelecionado);
        window.location.href = "TelaDePagamento.html";
    }
});