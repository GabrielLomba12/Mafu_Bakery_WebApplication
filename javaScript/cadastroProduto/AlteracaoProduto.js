// var API = "4.228.231.149"; //Setar essa variavel quando subir para a nuvem e comentar a localhost
var API = "localhost"; //Setar essa variavel quando testar local e comentar a do IP

var permissao = localStorage.getItem("permissao")
let productId = null;
let listaImagensExcluidas = []
let dadosIngrediente = []
let imagensNovasAdicionais = [];
let ingredienteSelect = document.getElementById("textarea-tam-est");

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    productId = urlParams.get('id');

    if (productId) {
        // Modo de edição: carregar os dados do produto
        fetchBuscaProduto(productId);
    }
    
});

function obterIngredientes() {
    const ingredientes = [];
    
    const linhas = ingredienteSelect.value.split('\n'); // Cada linha é um ingrediente
    linhas.forEach(linha => {
        const partes = linha.split('Ingrediente:');
        const quantidade = partes[0].replace('Quantidade:', '').trim(); // Extrai a quantidade
        const idIngrediente = partes[1].trim(); // Extrai o ID do ingrediente
        
        if (quantidade && idIngrediente) {
            ingredientes.push({
                id: parseInt(idIngrediente),
                quantidade: parseFloat(quantidade)
            });
        }
    });

    return ingredientes;
}

document.getElementById("btn-excluir").addEventListener('click', function (event) {
    event.preventDefault(); // Evita o comportamento padrão do botão

    // Limpar apenas o conteúdo da textArea específica
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
    const inputImagens = document.getElementById("preview-imagens-adicionais");
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
    }
    // Preenchendo ingredientes
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

    const ingredientesDados = obterIngredientes();

    const produto = {
        nome: document.getElementById('nomeProduto').value,
        descricao: document.getElementById('descricao').value,
        preco: document.getElementById('preco').value,
        tamanho: document.getElementById('tamanho').value,
        categoria: document.getElementById('categoria').value,
        ingredientes: ingredientesDados,
        qtdIngredientes: document.getElementById('qtd-ingrediente').value,
        avaliacao: document.getElementById('avaliacao').value,
        urlImagensExcluidas: listaImagensExcluidas
    };

    formData.append('produto', new Blob([JSON.stringify(produto)], { type: 'application/json' }));

    // Adiciona a imagem principal
    const imagemPrincipalInput = document.getElementById("input-imagem-principal");
    if (imagemPrincipalInput.files[0]) {
        console.log("Nova imagem principal encontrada:", imagemPrincipalInput.files[0]);
        formData.append("imagemPrincipal", imagemPrincipalInput.files[0]);
    }else{
        console.log("Imagem principal não alterada.");
    }

    // Adiciona os arquivos de imagem adicionais
    console.log(imagensNovasAdicionais.length);
    imagensNovasAdicionais.forEach(image => {
        formData.append('imagensNovas', image);
    });

    mostrarLoading();
    fetch(`http://`+API+`:8080/api/produtos/alterar?id=${productId}`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        body: formData
    })
    .then(response => {
        if (response.status === 200) {
            setTimeout(() => {
                esconderLoading();
                alert("Produto alterado com sucesso!");
                window.location.href = "TelaBackOffice.html";
            }, 3000);
        } 
    })
    .catch(error => {
        console.error('Erro ao alterar produto:', error);
        alert("Erro ao alterar produto. Por favor, tente novamente.");
        esconderLoading();
        document.querySelector(".main").classList.remove('blur');
    });
}

function alteraImagemPrincipal(event) {
    const imgPrincipal = document.getElementById("imagem-principal");
    listaImagensExcluidas.push(imgPrincipal.src);
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            imgPrincipal.src = e.target.result; 
        };
        reader.readAsDataURL(file); // Lê a imagem como URL
    }
}

function incluirNovasImagensAdicionais(evento) {
    const arquivos = evento.target.files;

    for (let i = 0; i < arquivos.length; i++) {
        imagensNovasAdicionais.push(arquivos[i]);
        const arquivo = arquivos[i];
        // Verifica se o arquivo é uma imagem
        if (arquivo && arquivo.type.startsWith('image/')) {
            const leitor = new FileReader();

            leitor.onload = function (e) {

                const imagemContainer = document.createElement('div');
                imagemContainer.classList.add('imagem-container');

                const img = document.createElement('img');
                img.src = e.target.result;
                img.classList.add('imagem-preview');
                
                const botaoRemover = document.createElement('button');
                botaoRemover.textContent = 'Remover';
                botaoRemover.classList.add('botao-remover');

                botaoRemover.addEventListener('click', function () {
                    imagemContainer.remove(); // Remove o container da imagem
                });

                imagemContainer.appendChild(img);
                imagemContainer.appendChild(botaoRemover);
                containerImagens.appendChild(imagemContainer);
            };

            leitor.readAsDataURL(arquivo); // Lê o arquivo como URL para exibir
        }
    }
}

const form = document.querySelector('form');
form.addEventListener('submit', (event) => {
    // Customizar validação
    validarFormulario(event);
});
id="btn-img-secundaria"
function alterarInterfaceParaEdicaoDoProduto() {
    if(permissao === "ESTOQUISTA")
        document.querySelector('h2').textContent = 'Edite o estoque do produto!';
    else {
        const textoBotao = document.getElementById("btn-img-principal")
        textoBotao.textContent = "Alterar Imagem Principal";
        const botao_incluir_img = document.getElementById("input-imagem-principal")
        botao_incluir_img.removeEventListener("change", carregaImagemPrincipal);
        botao_incluir_img.addEventListener("change", alteraImagemPrincipal);
        const botaoIncluirImgAdicionais = document.getElementById("input-imagens")
        botaoIncluirImgAdicionais.removeEventListener("change", incluirImagensAdicionais);
        botaoIncluirImgAdicionais.addEventListener("change", incluirNovasImagensAdicionais);
        document.querySelector("#colorBtn").removeEventListener("click", cadastrarProd);
        document.querySelector("#colorBtn").addEventListener("click", function (event) {
            event.preventDefault(); // Evita o comportamento padrão do formulário
            alterarDadosDoProduto(productId); // Chama a função para adicionar na lista
        });
        document.querySelector('h2').textContent = 'Edite os dados do produto!';
    }
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
