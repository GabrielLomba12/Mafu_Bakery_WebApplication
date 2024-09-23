// var API = "4.228.231.149"; //Setar essa variavel quando subir para a nuvem e comentar a localhost
var API = "localhost"; //Setar essa variavel quando testar local e comentar a do IP

var permissao = localStorage.getItem("permissao")
let productId = null;
let listaImagensExcluidas = []

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    productId = urlParams.get('id');

    if (productId) {
        // Modo de edição: carregar os dados do produto
        fetchBuscaProduto(productId);
    }
    
});

document.getElementById("btn-excluir").addEventListener('click', function (event) {
    event.preventDefault(); // Evita o comportamento padrão do botão

    // Limpar apenas o conteúdo da textArea específica
    const ingredienteSelect = document.getElementById("textarea-tam-est");
    ingredienteSelect.value = '';  // Limpa apenas o conteúdo da textArea de ingredientes
});


function voltaPraTelaBackOffice() {
    window.location.href = "TelaBackOffice.html";
}

document.getElementById("colorCancel").addEventListener('click', voltaPraTelaBackOffice);

function fetchBuscaProduto(productId) {
    fetch(`http://${API}:8080/api/produtos/recuperaProduto?id=${productId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => preencherFormulario(data))
    .catch(error => console.error('Erro ao buscar produto:', error));
    alterarInterfaceParaEdicaoDoProduto();
}

function preencherFormulario(data) {
    const inputImagemPrincipal = document.getElementById("preview-imagem-principal");
    const botao_incluir_img = document.getElementById("input-imagem-principal")
    const inputImagens = document.getElementById("preview-imagens-adicionais");
    const ingredienteSelect = document.getElementById("textarea-tam-est");
    const botao_incluir = document.getElementById("btn-incluir");
    // Preencher os campos do formulário com os dados recebidos
    document.getElementById("nomeProduto").value = data.nome;
    document.getElementById("preco").value = data.preco;
    document.getElementById("avaliacao").value = data.avaliacao;
    document.getElementById("descricao").value = data.descricao;
    document.getElementById("categoria").value = data.categoria;
    document.getElementById("tamanho").value = data.tamanho;
    document.getElementById("estoque").value = data.quantidadeEstoque;

    if(permissao === "ESTOQUISTA") {
        document.getElementById("nomeProduto").disabled = true;
        document.getElementById("preco").disabled = true;
        document.getElementById("avaliacao").disabled = true;
        document.getElementById("descricao").disabled = true;
        document.getElementById("categoria").disabled = true;
        document.getElementById("tamanho").disabled = true;
        document.getElementById("ingrediente").disabled = true;
        document.getElementById("btn-excluir").disabled = true;
        ingredienteSelect.disabled = true;
        document.getElementById("btn-img-principal").style.display = "none";
        document.getElementById("btn-img-secundaria").style.display = "none";
        document.getElementById("colorBtn").style.display = "none";
        document.getElementById("qtd-ingrediente").placeholder = "Qtd. a inserir"
        botao_incluir.removeEventListener('click', adicionarIngrediente)
        botao_incluir.addEventListener('click', function (event) {
            event.preventDefault(); // Evita o comportamento padrão do formulário
            const qtd_produto = document.getElementById("qtd-ingrediente").value;
            fetchConfeccionaProduto(productId, qtd_produto); // Chama a função para adicionar na lista
        });
    } else if(permissao === "ADMINISTRADOR") {
        botao_incluir_img.removeEventListener("change", carregaImagemPrincipal);
        botao_incluir_img.addEventListener("change", alteraImagemPrincipal);
        document.querySelector("#colorBtn").removeEventListener("click", cadastrarProd);
        document.querySelector("#colorBtn").addEventListener("click", alterarDadosDoProduto(productId));
    }
    // Preenchendo ingredientes
    let dadosIngrediente = []
    ingredienteSelect.innerHTML = ''; // Limpa o campo antes de adicionar ingredientes
    data.ingredientes.forEach(ingrediente => {
        const quantidade = ingrediente.quantidade;
        const ingredienteid = ingrediente.id;
        dadosIngrediente.push({quantidade, ingredienteid});
        const texto = dadosIngrediente.map(item => `Quantidade: ${item.quantidade}, Ingrediente: ${item.ingredienteid}`).join('\n');
        ingredienteSelect.value = texto;
    });

    data.imagens.forEach(url => {
        if(url.principal === true) {
            const imgElement = document.getElementById('imagem-principal');
            imgElement.src = url.url;
            imgElement.alt = data.nome;
            imgElement.style.display = "block";
            imgElement.classList.add('imagem-preview'); // Classe para estilização
            inputImagemPrincipal.appendChild(imgElement);
        } else {
            const imagemContainer = document.createElement('div');
            imagemContainer.classList.add('imagem-container');

            const botaoRemover = document.createElement('button');
            botaoRemover.textContent = 'Remover';
            botaoRemover.classList.add('botao-remover');
            botaoRemover.addEventListener('click', function () {
                listaImagensExcluidas.push(url.url)
                console.log(listaImagensExcluidas);
                imagemContainer.remove(); // Remove o container da imagem
            });
            const imgElement = document.createElement('img');
            imgElement.src = url.url;
            imgElement.alt = data.nome;
            imgElement.classList.add('imagem-preview'); // Classe para estilização
            imagemContainer.appendChild(imgElement);
            imagemContainer.appendChild(botaoRemover);
            inputImagens.appendChild(imagemContainer);
        }
    });

}

function alterarDadosDoProduto(productId) {
    const formData = new FormData();

    const dadosIngr = obterIngredientes();

    const produto = {
        nome: document.getElementById('nomeProduto').value,
        descricao: document.getElementById('descricao').value,
        preco: document.getElementById('preco').value,
        tamanho: document.getElementById('tamanho').value,
        categoria: document.getElementById('categoria').value,
        ingredientes: dadosIngr,
        qtdIngredientes: document.getElementById('qtd-ingrediente').value,
        avaliacao: document.getElementById('avaliacao').value
    };

    const produtoBlob = new Blob([JSON.stringify(produto)], { type: 'application/json' });
    formData.append('produto', produtoBlob);

    // Adiciona a imagem principal
    const imagemPrincipalInput = document.getElementById("input-imagem-principal");
    if (imagemPrincipalInput.files[0]) {
        console.log("Imagem principal encontrada:", imagemPrincipalInput.files[0]);
        formData.append("imagemPrincipal", imagemPrincipalInput.files[0]);
    }else{
        throw new Error("Imagem principal não foi selecionada!")
    }

    // Adiciona os arquivos de imagem adicionais
    const imagensInput = document.querySelector("#input-imagens");
    for (let i = 0; i < imagensInput.files.length; i++) {
        formData.append("imagensNovas", imagensInput.files[i]);
    }

    for (let i = 0; i < listaImagensExcluidas.length; i++) {
        formData.append("urlImagensExcluidas", listaImagensExcluidas[i]);
    }

    mostrarLoading();
    fetch(`http://`+API+`:8080/api/produtos/alterar?id=${productId}`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (response.status === 200) {
            setTimeout(() => {
                esconderLoading();
                document.querySelector("#card-modal").style.display = "flex";
            }, 3000);
        } 
    })
    .catch(error => {
        console.error('Erro ao alterar produto:', error);
        alert("Erro ao alterar usuário. Por favor, tente novamente.");
        esconderLoading();
        document.querySelector(".main").classList.remove('blur');
    });
}

function alteraImagemPrincipal(event) {
    const imgPrincipal = document.getElementById("imagem-principal");
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            imgPrincipal.src = e.target.result; 
        };
        reader.readAsDataURL(file); // Lê a imagem como URL
    }
}

const form = document.querySelector('form');
form.addEventListener('submit', (event) => {
    // Customizar validação
    validarFormulario(event);
});

function alterarInterfaceParaEdicaoDoProduto() {
    if(permissao === "ESTOQUISTA")
        document.querySelector('h2').textContent = 'Edite o estoque do produto!';
    else
        document.querySelector('h2').textContent = 'Edite os dados do produto!';
}

function fetchConfeccionaProduto(productId, qtd_produto) {
    fetch(`http://${API}:8080/api/produtos/confeccionaProdutos?id=${productId}&quantidade=${qtd_produto}`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if(response.status === 200) {
            document.getElementById("card-modal-alteracao").style.display = "flex";
            document.getElementById("qtd-ingrediente").value = "";
        }
        else if(response.status === 401) {
            return response.json();
        }
    })
    .then(data => {
        if (data) {
            exibirModalIngredientesFaltantes(data); // Passa os dados para a função
        }
    })
    .catch(error => console.error('Erro:', error));
}

function exibirModalIngredientesFaltantes(response) {

    if (!Array.isArray(response)) {
        console.error("Esperava-se um array, mas recebeu: ", response);
        return;
    }

    const ingredientesFaltantes = document.getElementById("textarea-ingredientes-faltantes");

    let dadosIngredientesFaltantes = []
    ingredientesFaltantes.innerHTML = ''; // Limpa o campo antes de adicionar ingredientes
    response.forEach(ingrediente => {
        const quantidade = ingrediente.quantidadeEstoque;
        const nome = ingrediente.nome;
        dadosIngredientesFaltantes.push({nome, quantidade});
        const texto = dadosIngredientesFaltantes.map(item => `Nome: ${item.nome}, Qtd. Estoque: ${item.quantidade}`).join('\n');
        ingredientesFaltantes.value = texto;
    });

    document.querySelector("#card-modal").style.display = "flex";

    document.querySelector("#btnok").onclick = function() {
        fecharModalIngredientesFaltantes();
    };
}

function fecharModalIngredientesFaltantes() {
    document.querySelector("#card-modal").style.display = "none";
    document.getElementById("qtd-ingrediente").value = "";
}
