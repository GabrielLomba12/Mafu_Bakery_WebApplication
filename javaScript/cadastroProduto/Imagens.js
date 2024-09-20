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
