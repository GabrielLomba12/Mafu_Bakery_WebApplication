// var API = "4.228.231.149"; // Setar essa variavel quando subir para a nuvem e comentar a localhost
var API = "localhost"; // Setar essa variavel quando testar local e comentar a do IP

const divPreview = document.querySelector('.content');
let imagemAtual = 0;

// Função para extrair o ID do produto da URL
function getProdutoIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('produtoId');
}

// Exemplo de uso:
const produtoId = getProdutoIdFromURL();
console.log(produtoId); // Verifique se o ID do produto está correto

// Agora você pode usar o produtoId para buscar os detalhes do produto e exibi-los na tela
fetch(`http://${API}:8080/api/produtos/exibicao?id=${produtoId}`, {
    method: 'GET',
})
.then(response => response.json())
.then(data => {
    // Lógica para exibir os detalhes do produto na tela
    console.log(data);
    divPreview.innerHTML = '';

    const divInformacoes = document.createElement('div');
    const divImagens = document.createElement('div');

    divInformacoes.classList.add('div-informacoes');
    divImagens.classList.add('div-imagens');

    let imagens = data.imagens;

    function mostrarImagem(index) {
        divImagens.innerHTML = ''; 

        const imgElement = document.createElement('img');
        imgElement.src = imagens[index];
        imgElement.alt = `${data.nome} imagem`;
        imgElement.style.width = "400px";
        imgElement.classList.add('img-carousel');
        divImagens.appendChild(imgElement);

        const prevButton = document.createElement('button');
        prevButton.id = 'prev-button';
        prevButton.classList.add('prev');
        prevButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-left" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
            </svg>
        `;
        // prevButton.innerText = '◀';
        prevButton.onclick = () => {
            imagemAtual = (imagemAtual > 0) ? imagemAtual - 1 : imagens.length - 1;
            mostrarImagem(imagemAtual);
        };

        const nextButton = document.createElement('button');
        nextButton.id = 'next-button';
        nextButton.classList.add('next');
        nextButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-right" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
            </svg>
        `;
        // nextButton.innerText = '▶';
        nextButton.onclick = () => {
            imagemAtual = (imagemAtual < imagens.length - 1) ? imagemAtual + 1 : 0;
            mostrarImagem(imagemAtual);
        };

        divImagens.appendChild(prevButton);
        divImagens.appendChild(nextButton);
    }

    mostrarImagem(imagemAtual);

    divPreview.appendChild(divImagens);

    divInformacoes.innerHTML = `
        <p class="nomeProd">${data.nome}</p>
        <div class="descricao">
            <p>${data.descricao}</p>
        </div>
        
        <p>Avaliação: ${data.avaliacao}</p>
        <p>R$ ${data.preco}</p>
        <button class="buttonComprar" type="submit" disabled>Comprar</button>
    `
    divPreview.appendChild(divInformacoes);
    // Continue com os campos que forem necessários
})
.catch(error => {
    console.error("Erro ao buscar detalhes do produto:", error);
    alert("Erro ao carregar os detalhes do produto.");
});
