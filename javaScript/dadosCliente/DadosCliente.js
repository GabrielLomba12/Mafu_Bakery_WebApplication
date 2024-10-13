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
            <p>${data.nomeCompleto}</p> 
            <p>${formattedDate}</p> 
            <p>${formattedCpf}</p> 
            <p>${data.genero}</p> 
        `;

        // const senha = data.senha;
        // const maskedSenha = '*'.repeat(senha.length);

        // senhaUsuario.innerHTML = ` <p>${maskedSenha}</p> `
    })
}

function formatarCPF(cpf) {
    // Remove todos elementos não numericos
    cpf = cpf.replace(/\D/g, '');

    // Formata o CPF no padrão XXX.XXX.XXX-XX
    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
    cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

    return cpf;
}