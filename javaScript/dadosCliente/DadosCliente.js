// var API = "4.228.231.149"; //Setar essa variavel quando subir para a nuvem e comentar a localhost
var API = "localhost"; //Setar essa variavel quando testar local e comentar a do IP

let dadosUsuario = document.getElementById("dados-usuario")

const email = localStorage.getItem("email");
const id = localStorage.getItem("ClienteId");

preencherInformacoesCliente();
preencherEnderecosCliente();

function preencherInformacoesCliente() {
    fetch(`http://${API}:8080/api/cliente/infoCliente?email=${email}`, {
        method: 'GET',
        headers : {
            "Content-Type": "application/json"
        }
    }) 
    .then(response => {
        if(response.ok) {
            return response.json();
        } else  
            throw new Error('Erro ao coletar dados do usuário.')
    })
    .then(data => {
        const dados = JSON.stringify(data);
        localStorage.setItem("dados-pessoais-usuario", dados)
        const isoDate = data.dataDeNascimento;
        const [year, month, day] = isoDate.split('T')[0].split('-');
        const formattedDate = `${day}/${month}/${year}`;
        const formattedCpf = formatarCPF(data.cpf)

        dadosUsuario.innerHTML = 
        ` 
            <p><strong>Nome Completo:</strong> ${data.nomeCompleto}</p> 
            <p><strong>Data de Nascimento:</strong> ${formattedDate}</p> 
            <p><strong>CPF:</strong> ${formattedCpf}</p> 
            <p><strong>Gênero:</strong> ${data.genero}</p> 
        `;

        const btnPreencher = document.getElementById('botao-usuario');
        btnPreencher.addEventListener('click', () => {
        document.getElementById('nome-usuario').value = data.nomeCompleto;
        document.getElementById('data-nascimento').value = isoDate.split('T')[0];
        document.getElementById('genero').value = data.genero;
        });
    })
}

function preencherModalCliente() {
    fetch(`http://${API}:8080/api/cliente/infoCliente?email=${email}`, {
        method: 'GET',
        headers : {
            "Content-Type": "application/json"
        }
    }) 
    .then(response => {
        if(response.ok) {
            return response.json();
        } else  
            throw new Error('Erro ao coletar dados do usuário.')
    })
}

function preencherEnderecosCliente() {
    fetch(`http://${API}:8080/api/endereco/enderecosCliente?id=${id}`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Erro ao acessar a API: " + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        let primeiroEndereco = document.getElementById("primeiro-endereco");
        let listaEndereco = document.querySelector(".lista-enderecos");
        primeiroEndereco.innerHTML = "";

        let qtdLinha = 0;
        let linhaEndereco;

        data.forEach((endereco, indice) => {
            let cadastrarEndereço = document.createElement('div');
            cadastrarEndereço.classList.add('cadastrar-endereco');

            let novoEndereco = document.createElement('div');
            novoEndereco.classList.add('enderecos');
            novoEndereco.id = "enderecos-lista";

            if (qtdLinha === 0) {
                linhaEndereco = document.createElement('div');
                linhaEndereco.classList.add('linha-endereco');
            }

            let enderecoConcatenado = (endereco.rua + ', ' + endereco.numero) + ' - ' + (endereco.complemento ? `${endereco.complemento}` : '');

            if (indice === 0) {
                cadastrarEndereço.innerHTML = `
                    <div class="novo-endereco">
                        <p>Novo Endereço</p>
                        <h2>+</h2>
                    </div>
                `;
                cadastrarEndereço.addEventListener('click', function () {
                    const modalEndereco = document.querySelector('#cartao-endereco');
                    modalEndereco.style.display = 'flex';
                    document.querySelector('#cartao-endereco h2').innerText = 'NOVO ENDEREÇO';
                    document.querySelector('#salvar-endereco').addEventListener('click', function () {
                        cadastrarNovoEndereco(id);
                        modalEndereco.style.display = 'none';
                        mostrarLoading();
                    });
                });

                novoEndereco.innerHTML = `
                <div class="dados" data-endereco-id="${endereco.id}">
                    <div id="dados-endereco">
                        <h3>Tipo de Endereço: ${endereco.tipo}</h3>
                        <p>${enderecoConcatenado}</p>
                        <p>${endereco.bairro}</p>
                        <p>${endereco.cidade + ', ' + endereco.uf + '-' + endereco.cep}</p>
                        <p><strong>${endereco.principal ? '(Principal)' : ''}</strong></p>
                    </div>
                    <div class="button-endereco">
                        ${endereco.principal ? '' : '<button class="editar-infos modal-endereco salvar-endereco btn-end-p">DEFINIR COMO PRINCIPAL</button>'}
                    </div>
                </div>
                `;
                
                // Listener para o botão "Definir como Principal"
                if (!endereco.principal) {
                    const botaoPrincipal = novoEndereco.querySelector('.btn-end-p');
                    botaoPrincipal.addEventListener('click', function() {
                        definirComoPrincipal(endereco.id, id);
                    });
                }

                primeiroEndereco.appendChild(cadastrarEndereço);
                primeiroEndereco.appendChild(novoEndereco);
            } else {
                novoEndereco.innerHTML = `
                <div class="dados" data-endereco-id="${endereco.id}">
                    <div id="dados-endereco">
                        <h3>Tipo de Endereço: ${endereco.tipo}</h3>
                        <p>${enderecoConcatenado}</p>
                        <p>${endereco.bairro}</p>
                        <p>${endereco.cidade + ', ' + endereco.uf + '-' + endereco.cep}</p>
                        <p><strong>${endereco.principal ? '(Principal)' : ''}</strong></p>
                    </div>
                    <div class="button-endereco">
                        ${endereco.principal ? '' : '<button class="editar-infos modal-endereco salvar-endereco btn-end-p">DEFINIR COMO PRINCIPAL</button>'}
                    </div>
                </div>
                `;

                if (!endereco.principal) {
                    const botaoPrincipal = novoEndereco.querySelector('.btn-end-p');
                    botaoPrincipal.addEventListener('click', function() {
                        definirComoPrincipal(endereco.id, id);
                    });
                }

                linhaEndereco.appendChild(novoEndereco);
                qtdLinha++;

                if (qtdLinha === 2) {
                    listaEndereco.appendChild(linhaEndereco);
                    qtdLinha = 0;
                } else if (indice === data.length - 1) {
                    listaEndereco.appendChild(linhaEndereco);
                }
            }
        });
    })
    .catch(error => {
        console.log("Erro: " + error);
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

function limparCampos() {
    document.getElementById('bairro').value = '';
    document.getElementById('cidade').value = '';
    document.getElementById('uf').value = '';
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
        return response.json();
    })
    .then(data => {
        alert("Endereço cadastrado com sucesso!");
        location.reload(); 
    })
    .catch(error => {
        console.log("Erro: " + error);
    })
    .finally(() => {
        btnSalvar.disabled = false;
    });
}

function definirComoPrincipal(enderecoId, clienteId) {
    fetch(`http://${API}:8080/api/endereco/enderecoPrincipal?enderecoId=${enderecoId}&clienteId=${clienteId}`, {
        method: 'PATCH', 
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Erro ao definir endereço como principal: " + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        alert("Endereço definido como principal", data);
        location.reload();
    })
    .catch(error => {
        console.log("Erro: " + error);
    });
}

function formatarCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
    cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    return cpf;
}