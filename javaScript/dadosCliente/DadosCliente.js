// var API = "4.228.231.149"; //Setar essa variavel quando subir para a nuvem e comentar a localhost
var API = "localhost"; //Setar essa variavel quando testar local e comentar a do IP

let dadosUsuario = document.getElementById("dados-usuario")

const email = localStorage.getItem("email");

preencherInformacoesCliente();

function preencherInformacoesCliente() {
    fetch(`http://${API}:8080/api/cliente/infoCliente?email=${email}`, {
        method: 'GET',
        headers : {
            "Content-Type": "application/json"
        }
    }) 
    .then(response => {
        if(response.ok) {
            return response.json();
        } else  
            throw new Error('Erro ao coletar dados do usuário.')
    })
    .then(data => {
        const dados = JSON.stringify(data);
        localStorage.setItem("dados-pessoais-usuario", dados)
        const isoDate = data.dataDeNascimento;
        const [year, month, day] = isoDate.split('T')[0].split('-');
        const formattedDate = `${day}/${month}/${year}`;
        const formattedCpf = formatarCPF(data.cpf)

        dadosUsuario.innerHTML = 
        ` 
            <p><strong>Nome Completo:</strong> ${data.nomeCompleto}</p> 
            <p><strong>Data de Nascimento:</strong> ${formattedDate}</p> 
            <p><strong>CPF:</strong> ${formattedCpf}</p> 
            <p><strong>Gênero:</strong> ${data.genero}</p> 
        `;

        const btnPreencher = document.getElementById('botao-usuario');
        btnPreencher.addEventListener('click', () => {
        document.getElementById('nome-usuario').value = data.nomeCompleto;
        document.getElementById('data-nascimento').value = isoDate.split('T')[0];
        document.getElementById('genero').value = data.genero;
        });
    })
}

function preencherModalCliente() {
    fetch(`http://${API}:8080/api/cliente/infoCliente?email=${email}`, {
        method: 'GET',
        headers : {
            "Content-Type": "application/json"
        }
    }) 
    .then(response => {
        if(response.ok) {
            return response.json();
        } else  
            throw new Error('Erro ao coletar dados do usuário.')
    })
    .then(data => {
        
    })
}

function formatarCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
    cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    return cpf;
}