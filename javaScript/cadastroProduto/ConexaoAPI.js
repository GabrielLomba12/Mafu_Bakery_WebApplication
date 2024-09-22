// var API = "4.228.231.149"; //Setar essa variavel quando subir para a nuvem e comentar a localhost
var API = "localhost"; //Setar essa variavel quando testar local e comentar a do IP
var token = localStorage.getItem("tokenAcesso");
let dadosIngr = [];
const Iquantidade = document.querySelector("#qtd-ingrediente");
const Iingrediente = document.querySelector("#ingrediente");

document.addEventListener("DOMContentLoaded", listarIngredientes);

// async function listarIngredientes() {
//     let listaIngredientes = [];
//     await fetch(`http://${API}:8080/api/mp`, {
//         method: 'GET',
//         headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//         }
//     })
//     .then(response => {
//         if (!response.ok) {
//             throw new Error("Erro ao acessar a API: " + response.statusText);
//         }
//         return response.json();
//     })
//     .then(data => {
//         listaIngredientes = data;
//         const selectIngrediente = document.getElementById("ingrediente");
//         selectIngrediente.innerHTML = "";

//         const opcaoPadrao = document.createElement("option");
//         opcaoPadrao.value = "";
//         opcaoPadrao.text = "-";
//         opcaoPadrao.selected = true;
//         selectIngrediente.appendChild(opcaoPadrao);

//         data.forEach(ingrediente => {
//             const option = document.createElement("option");
//             option.value = ingrediente.id;  // Use o ID como valor para a seleção
//             option.text = `${ingrediente.id} - ${ingrediente.nome}`;
//             selectIngrediente.appendChild(option);
//         });
//     })
//     .catch(error => {
//         console.log("Erro: " + error);
//     });
// }

const nome = document.getElementById("nomeProduto");
const descricao = document.getElementById("descricao");
const preco = document.getElementById("preco");
const tamanho = document.getElementById("tamanho");
const categoria = document.getElementById("categoria"); // Assumindo que a categoria é a mesma que o tamanho
const avaliacao = document.getElementById("avaliacao");
const qtdIngredientes = document.getElementById("qtd-ingrediente");
const ingredientes = document.getElementById("ingrediente");

const ingredientesTextarea = document.getElementById("textarea-tam-est"); // O ID do seu textarea que contém os ingredientes

function obterIngredientes() {
    const ingredientes = [];
    
    const linhas = ingredientesTextarea.value.split('\n'); // Cada linha é um ingrediente
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

async function cadastrar() {
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
        formData.append("imagens", imagensInput.files[i]);
    }

    // Faz a requisição POST com o FormData
    await fetch(`http://localhost:8080/api/produtos/cadastrar`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: formData
    })
    .then(async response => {
        if (response.ok) {
            alert("Produto cadastrado com sucesso!");
            document.querySelector(".form").reset();
            window.location.href = 'TelaBackOffice.html';
        } else {
            const errorData = await response.json();
            throw new Error("Erro ao cadastrar o produto: " + errorData.message);
        }
    })
    .catch(error => {
        console.error("Erro ao cadastrar o produto:", error);
        alert("Erro ao cadastrar o produto: " + error.message);
    });
}

document.querySelector("#colorBtn").addEventListener("click", function (event) {
    event.preventDefault();
    cadastrar();
});

document.querySelector('#btn-incluir').addEventListener('click', function (event) {
    event.preventDefault(); 
    adicionarIngrediente(); 
});

function adicionarIngrediente(){
    const quantidade = Iquantidade.value.trim();
    const ingrediente = Iingrediente.value.trim();

    if(quantidade && ingrediente){
        dadosIngr.push({quantidade, ingrediente})

        atualizarTextarea()

        Iquantidade.value = '';
        Iingrediente.value = '';
    }else {
        alert('Por favor, preencha os campos de tamanho e estoque.');
    }
}

function atualizarTextarea() {
    // Monta a string com os valores do vetor
    const texto = dadosIngr.map(item => `Quantidade: ${item.quantidade}, Ingrediente: ${item.ingrediente}`).join('\n');

    document.getElementById('textarea-tam-est').value = texto;
}

const inputImagemPrincipal = document.getElementById("input-imagem-principal");
const inputImagensAdicionais = document.getElementById("input-imagens");
const imgPrincipal = document.getElementById("imagem-principal");
const containerImagens = document.getElementById("container-imagens");

// Evento para a imagem principal
inputImagemPrincipal.addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            imgPrincipal.src = e.target.result; 
            imgPrincipal.style.display = 'block';
        };
        reader.readAsDataURL(file); // Lê a imagem como URL
    }
});

inputImagensAdicionais.addEventListener('change', function (evento) {
    const arquivos = evento.target.files;

    for (let i = 0; i < arquivos.length; i++) {
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
});

