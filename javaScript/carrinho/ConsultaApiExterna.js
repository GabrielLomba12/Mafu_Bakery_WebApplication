document.getElementById('btn-calc').addEventListener('click', function() {
    let cep = document.getElementById('cep').value.replace(/\D/g, ''); // Remove caracteres não numéricos

    if (cep.length === 8) {
        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then(response => response.json())
            .then(data => {
                if (!data.erro) {
                    document.getElementById('rua').value = data.logradouro;
                    document.querySelector(".btn1").style.display = "flex"
                    document.querySelector(".btn2").style.display = "flex"
                    document.querySelector(".btn3").style.display = "flex"
                } else {
                    document.getElementById('rua').value = "CEP não encontrado!";
                }
            })
            .catch(error => console.error('Erro ao consultar o CEP:', error));
    } else {
        document.getElementById('rua').value = "CEP inválido!";
    }
});

