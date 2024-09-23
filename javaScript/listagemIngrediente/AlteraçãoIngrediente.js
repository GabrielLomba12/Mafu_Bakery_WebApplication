var API = "4.228.231.149"; //Setar essa variavel quando subir para a nuvem e comentar a localhost
// var API = "localhost"; //Setar essa variavel quando testar local e comentar a do IP

var token = localStorage.getItem("tokenAcesso");

let ingrediente = localStorage.getItem("ingredienteId")

document.addEventListener('DOMContentLoaded', () => {
    if(ingrediente) {
        carregarDadosIngrediente(ingrediente);
    }
});

async function carregarDadosIngrediente(id) {
    await fetch(`http://${API}:8080/api/mp/mpPorId?id=${id}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => preencherFormulario(data))
    .catch(error => console.error('Erro ao buscar ingrediente:', error));
    alterarInterfaceParaEdicaoDoIngrediente();
}

function preencherFormulario(data) {
    document.getElementById('nomeIngrediente').value = data.nome;
    document.getElementById('descricao').value = data.descricao;
    document.getElementById('preco').value = data.preco;
    document.getElementById('estoque').value = data.quantidadeEstoque;

    const unidadeMedida = document.getElementById('unidadeMedida');
    const option = Array.from(unidadeMedida.options).find(opt => opt.value === data.unidadeMedida);
    if (option) {
        unidadeMedida.value = data.unidadeMedida;
    } else {
        console.warn('Unidade de medida não encontrada:', data.unidadeMedida);
    }

    const permissao = localStorage.getItem("permissao");

    if(permissao === "ADMINISTRADOR") {
        document.getElementById('estoque').disabled = true;
        document.querySelector(".form").removeEventListener("submit", validarCamposIngrediente);
        document.querySelector(".form").addEventListener("submit", alterarDadosIngrediente);
    } else if (permissao === "ESTOQUISTA") {
        document.getElementById('nomeIngrediente').disabled = true;
        document.getElementById('descricao').disabled = true;
        document.getElementById('preco').disabled = true;
        document.getElementById('unidadeMedida').disabled = true;
        document.getElementById('estoque').disabled = true;

        document.querySelector(".form").removeEventListener("submit", validarCamposIngrediente);
        document.querySelector(".form").addEventListener("submit", adicionarNovoEstoque);

        const novoCampoHTML = `
            <div class="col-md-6 mb-3">
                <label for="estoque">Adicionar ao estoque</label>
                <input type="text" class="form-control" id="estoqueNovo" placeholder="Digite a nova quantidade" required>
                <div class="invalid-feedback">
                    Informe o estoque.
                </div>
            </div>
        `;
        const unidadeMedidaDiv = document.getElementById('unidadeMedida').closest('.col-md-6');
        unidadeMedidaDiv.insertAdjacentHTML('afterend', novoCampoHTML);
    }  
}

function alterarDadosIngrediente(event) {
    event.preventDefault();

    const form = event.target;
    if (form.checkValidity()) {
        const ingredienteAlterado = {
            nome: document.getElementById('nomeIngrediente').value,
            descricao: document.getElementById('descricao').value,
            preco: parseFloat(document.getElementById('preco').value),
            unidadeMedida: document.getElementById('unidadeMedida').value,
        };

        mostrarLoading();
        fetch(`http://${API}:8080/api/mp?id=${ingrediente}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(ingredienteAlterado)
        })
        .then(response => {
            if (response.status === 200) {
                setTimeout(() => {
                    esconderLoading();
                    document.getElementById("card-modal").style.display = "flex";
                }, 3000);
            } else {
                const errorData = response.json(); 
                throw new Error("Erro ao alterar os dados do ingrediente: " + errorData.message);
            }
        })
        .catch(error => {
            console.error("Erro ao alterar os dados do ingrediente:", error);
            esconderLoading();
            document.querySelector(".main").classList.remove('blur');
        })
    }
}

function adicionarNovoEstoque(event) {
    event.preventDefault();
    const valorNovo = document.getElementById('estoqueNovo').value;
    mostrarLoading();
    fetch(`http://${API}:8080/api/mp/aumentarMp?id=${ingrediente}&novaQuantidade=${valorNovo}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (response.status === 200) {
            setTimeout(() => {
                esconderLoading();
                document.getElementById("card-modal").style.display = "flex";
            }, 3000);
        } else {
            const errorData = response.json(); 
            throw new Error("Erro ao alterar o estoque do ingrediente: " + errorData.message);
        }
    })
    .catch(error => {
        console.error("Erro ao alterar o estoque do ingrediente:", error);
        esconderLoading();
        document.querySelector(".main").classList.remove('blur');
    })
}


function alterarInterfaceParaEdicaoDoIngrediente() {
    if(permissao === "ESTOQUISTA") {
        document.querySelector('h2').textContent = 'Editar Estoque do Ingrediente!';
        document.getElementById('colorBtn').textContent = 'Atualizar Estoque'
    } else {
        document.querySelector('h2').textContent = 'Edite os dados do ingrediente!';
        document.getElementById('colorBtn').textContent = 'Confirmar Alteração'
    }
    document.getElementById("titulo").textContent = "Ingrediente atualizado!";
    document.getElementById("conteudo").textContent = "Ingrediente atualizado com sucesso!";
}