// var API = "4.228.231.149"; //Setar essa variavel quando subir para a nuvem e comentar a localhost
var API = "localhost"; //Setar essa variavel quando testar local e comentar a do IP
var token = localStorage.getItem("tokenAcesso");
let dadosIngr = []
const Iquantidade = document.querySelector("#qtd-ingrediente")
const Iingrediente = document.querySelector("#ingrediente")

document.addEventListener("DOMContentLoaded", listarIngredientes(),{})

async function listarIngredientes() {
    let listaIngredientes = [];
    await fetch(`http://${API}:8080/api/mp`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Erro ao acessar a API: " + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            listaIngredientes = data;
            const selectIngrediente = document.getElementById("ingrediente");
            selectIngrediente.innerHTML = "";

            const opcaoPadrao = document.createElement("option");
            opcaoPadrao.value = "";
            opcaoPadrao.text = "-";
            opcaoPadrao.selected = true;
            selectIngrediente.appendChild(opcaoPadrao);

            data.forEach(ingrediente => {
                const option = document.createElement("option");
                option.value = ingrediente.id;  // Use o ID como valor para a seleção
                option.text = `${ingrediente.id} - ${ingrediente.nome}`;
                selectIngrediente.appendChild(option);
            });
        })
        .catch(error => {
            console.log("Erro: " + error);
        });
}

let imageCount = 1; // Inicia o contador de imagens

document.getElementById('add-image-btn').addEventListener('click', function () {
    const container = document.getElementById('imagens-container');

    // Cria um novo div para a imagem
    const newImageDiv = document.createElement('div');
    newImageDiv.classList.add('EscolhaImg');

    // Adiciona um título para a nova imagem
    const newImageTitle = document.createElement('p');
    newImageTitle.innerText = `Imagem ${imageCount + 1}`;
    newImageDiv.appendChild(newImageTitle);

    // Cria o rótulo e o input para o upload de imagem
    const label = document.createElement('label');
    label.classList.add('picture');
    label.setAttribute('for', `picture__input_${imageCount}`);
    label.setAttribute('tabIndex', '0');
    newImageDiv.appendChild(label);

    const imageSpan = document.createElement('span');
    imageSpan.classList.add('picture__image');
    label.appendChild(imageSpan);

    const input = document.createElement('input');
    input.type = 'file';
    input.name = 'picture__input';
    input.id = `picture__input_${imageCount}`;
    input.setAttribute('multiple', true); // Permite múltiplos uploads de imagens
    newImageDiv.appendChild(input);

    container.appendChild(newImageDiv);
    imageCount++; // Incrementa o contador
});

// document.querySelector("form").addEventListener("submit", async function (event) {
//     event.preventDefault();

//     // Cria um objeto FormData para enviar os dados como multipart/form-data
//     let formData = new FormData();

//     // Obtém os valores dos campos de entrada
//     let nome = document.getElementById("nomeProduto").value;
//     let descricao = document.getElementById("descricao").value;
//     let preco = document.getElementById("preco").value;
//     let tamanho = document.getElementById("unidade").value;
//     let categoria = document.getElementById("unidade").value; // Assumindo que a categoria é a mesma que o tamanho
//     let avaliacao = document.getElementById("avaliacao").value;
//     let qtdIngredientes = document.getElementById("qtd-ingrediente").value;

//     // Adiciona os dados ao FormData
//     formData.append("nome", nome);
//     formData.append("descricao", descricao);
//     formData.append("preco", preco);
//     formData.append("tamanho", tamanho);
//     formData.append("categoria", categoria);
//     formData.append("avaliacao", avaliacao);
//     formData.append("qtdIngredientes", qtdIngredientes);

//     // Adiciona os ingredientes
//     // Supondo que os ingredientes sejam selecionados a partir de um campo select
//     let ingredientes = Array.from(document.getElementById("ingrediente").selectedOptions)
//         .map(option => option.value);
//     formData.append("ingredientes", JSON.stringify(ingredientes));

//     // Obtém os arquivos de imagem
//     let imagensInput = document.querySelector("input[type='file']");
//     for (let i = 0; i < imagensInput.files.length; i++) {
//         formData.append("imagens", imagensInput.files[i]);
//     }

//     try {
//         // Faz a requisição POST com o FormData
//         let response = await fetch("/api/produtos/cadastrar", {
//             method: "POST",
//             body: formData
//         });

//         if (response.ok) {
//             let data = await response.json();
//             alert("Produto cadastrado com sucesso!");
//             console.log("Produto cadastrado:", data);
//         } else {
//             let errorData = await response.json();
//             alert("Erro ao cadastrar o produto: " + errorData.message);
//         }
//     } catch (error) {
//         console.error("Erro ao cadastrar o produto:", error);
//         alert("Erro ao cadastrar o produto: " + error.message);
//     }
// });


const nome = document.getElementById("nomeProduto");
const descricao = document.getElementById("descricao");
const preco = document.getElementById("preco");
const tamanho = document.getElementById("unidade");
const categoria = document.getElementById("categoria"); // Assumindo que a categoria é a mesma que o tamanho
const avaliacao = document.getElementById("avaliacao");
const qtdIngredientes = document.getElementById("qtd-ingrediente");
const ingredientes = document.getElementById("ingrediente");

async function cadastrar() {
    const formData = new FormData();

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

    // Adiciona os arquivos de imagem
    let imagensInput = document.querySelector("input[type='file']");
    for (let i = 0; i < imagensInput.files.length; i++) {
        formData.append("imagens", imagensInput.files[i]);
    }
    console.log(produto.ingredientes)
    console.log(imagensInput.files[0])
    console.log(formData)

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
                return response.json();
            } else {
                const errorData = await response.json();
                throw new Error("Erro ao cadastrar o produto: " + errorData.message);
            }
        })
        .then(data => {
            console.log("Produto cadastrado:", data);
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
    event.preventDefault(); // Evita o comportamento padrão do formulário
    adicionarIngrediente(); // Chama a função para adicionar na lista
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

    // Atualiza a textarea com a string
    document.getElementById('textarea-tam-est').value = texto;
}