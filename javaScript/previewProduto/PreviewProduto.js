// var API = "4.228.231.149"; //Setar essa variavel quando subir para a nuvem e comentar a localhost
var API = "localhost"; //Setar essa variavel quando testar local e comentar a do IP

const token = localStorage.getItem("tokenAcesso");
const divPreview = document.querySelector('.content');

let imagemAtual = 0;

export function fetchPreviewProduto(id) {
    fetch(`http://${API}:8080/api/produtos/exibicao?id=${id}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        exibirModal();
        console.log(response);
        if (response.ok) {
            return response.json();
        } else {
            alert("Não foi possível acessar o preview do produto!");
        }
    })
    .then(data => {
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
            <button class="close-btn" onclick="fecharModal()">X</button>
            <p class="nomeProd">${data.nome}</p>
            <p>${data.descricao}</p>
            <p>Avaliação: ${data.avaliacao}</p>
            <p>R$ ${data.preco}</p>
            <button class="buttonComprar" type="submit" disabled>Comprar</button>
        `;
        divPreview.appendChild(divInformacoes);

    })
    .catch(error => {
        console.error("Erro ao buscar preview do produto:", error);
        alert("Ocorreu um erro ao acessar o preview do produto.");
    });
}
window.fetchPreviewProduto = fetchPreviewProduto;