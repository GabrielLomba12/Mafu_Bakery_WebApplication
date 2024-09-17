// // Inicializando o contador de imagens
// let contadorImagens = 1;

// document.getElementById('botao-adicionar-imagem').addEventListener('click', function () {
//     const container = document.getElementById('imagens-container');

//     // Cria um novo div para a imagem
//     const novaDivImagem = document.createElement('div');
//     novaDivImagem.classList.add('EscolhaImg');

//     // Adiciona um título para a nova imagem
//     const novoTituloImagem = document.createElement('p');
//     novoTituloImagem.innerText = `Imagem ${contadorImagens + 1}`;
//     novaDivImagem.appendChild(novoTituloImagem);

//     // Cria o rótulo e o input para o upload de imagem
//     const rotulo = document.createElement('label');
//     rotulo.classList.add('picture');
//     rotulo.setAttribute('for', `input_imagem_${contadorImagens}`);
//     rotulo.setAttribute('tabIndex', '0');
//     novaDivImagem.appendChild(rotulo);

//     const spanImagem = document.createElement('span');
//     spanImagem.classList.add('imagem__preview');
//     rotulo.appendChild(spanImagem);

//     const input = document.createElement('input');
//     input.type = 'file';
//     input.name = 'input_imagem';
//     input.id = `input_imagem_${contadorImagens}`;
//     input.setAttribute('multiple', true); // Permite múltiplos uploads de imagens
//     input.addEventListener('change', handlePreviewImagem); // Adiciona o evento de mudança
//     novaDivImagem.appendChild(input);

//     container.appendChild(novaDivImagem);
//     contadorImagens++; // Incrementa o contador de imagens
// });

// // Função para lidar com a pré-visualização de imagens
// function handlePreviewImagem(evento) {
//     const arquivos = evento.target.files;
//     const containerPreview = document.getElementById('container-preview');

//     // Limpa as pré-visualizações anteriores
//     // containerPreview.innerHTML = '';

//     for (let i = 0; i < arquivos.length; i++) {
//         const arquivo = arquivos[i];

//         // Verifica se o arquivo é uma imagem
//         if (arquivo && arquivo.type.startsWith('image/')) {
//             const leitor = new FileReader();

//             leitor.onload = function (e) {
//                 const img = document.createElement('img');
//                 img.src = e.target.result;
//                 img.classList.add('imagem-preview'); // Adiciona uma classe para estilização
//                 containerPreview.appendChild(img);
//             };

//             leitor.readAsDataURL(arquivo); // Lê o arquivo como URL para exibir
//         }
//     }
// }

// // Adiciona o evento de mudança ao input inicial de imagem
// document.getElementById('input_imagem_0').addEventListener('change', handlePreviewImagem);


// Seleciona o input de imagens e o container de pré-visualização
const inputImagens = document.getElementById('input-imagens');
const containerPreview = document.getElementById('container-preview');

// Adiciona o evento ao input para quando o usuário selecionar as imagens
inputImagens.addEventListener('change', function (evento) {
    const arquivos = evento.target.files;

    

    // Adiciona as novas imagens ao container
    for (let i = 0; i < arquivos.length; i++) {
        const arquivo = arquivos[i];

        // Verifica se o arquivo é uma imagem
        if (arquivo && arquivo.type.startsWith('image/')) {
            const leitor = new FileReader();

            leitor.onload = function (e) {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.classList.add('imagem-preview'); // Classe para estilização
                containerPreview.appendChild(img);
            };

            leitor.readAsDataURL(arquivo); // Lê o arquivo como URL para exibir
        }
    }
});
