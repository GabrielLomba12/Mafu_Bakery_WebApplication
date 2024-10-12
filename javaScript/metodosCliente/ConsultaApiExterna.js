document.getElementById('cep').addEventListener('blur', function() {
    let cep = document.getElementById('cep').value.replace(/\D/g, ''); // Remove caracteres não numéricos

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
        document.getElementById('rua').value = "CEP não encontrado!";
        limparCampos();
    }
});


function limparCampos() {
    document.getElementById('rua').value = '';
    document.getElementById('bairro').value = '';
    document.getElementById('cidade').value = '';
    document.getElementById('uf').value = '';
}


document.getElementById('cepFat').addEventListener('blur', function() {
    let cep = document.getElementById('cepFat').value.replace(/\D/g, ''); // Remove caracteres não numéricos

    if (cep.length === 8) {
        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then(response => response.json())
            .then(data => {
                if (!data.erro) {
                    document.getElementById('ruaFat').value = data.logradouro;
                    document.getElementById('bairroFat').value = data.bairro;
                    document.getElementById('cidadeFat').value = data.localidade;
                    document.getElementById('ufFat').value = data.uf;
                    
                } else {
                    document.getElementById('rua').value = "CEP não encontrado!";
                    limparCampos();
                }
            })
            .catch(error => console.error('Erro ao consultar o CEP:', error));
    } else {
        document.getElementById('rua').value = "CEP não encontrado!";
        limparCampos();
    }
});


function limparCampos() {
    document.getElementById('ruaFat').value = '';
    document.getElementById('bairroFat').value = '';
    document.getElementById('cidadeFat').value = '';
    document.getElementById('ufFat').value = '';
}