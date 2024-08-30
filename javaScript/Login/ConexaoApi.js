const formulario = document.querySelector("form")
const email = document.querySelector(".email")
const senha = document.querySelector(".senha")
const btnLogin = document.querySelector(".btn-login");
const show = document.querySelector(".modal-confirm");


function validarCampos() {
    const emailValue = email.value;
    const senhaValue = senha.value;

    // Verifica se o campo de e-mail está vazio
    if (emailValue.trim() === '') {
        alert("Por favor, preencha o campo de e-mail.");
        email.focus();
        return;
    }

    // Verifica se o campo de senha está vazio
    if (senhaValue.trim() === '') {
        alert("Por favor, preencha o campo de senha.");
        senha.focus();
        return;
    }
}

// function consultar() {

//     const login = {
//         "email": email.value,
//         "senha": senha.value
//     };

//     // console.log(login)
//     fetch('http://localhost:8080/api/login', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(login)
//     })
//         .then(response => {
//             if (response.status === 200) {
//                 // Login realizado com sucesso
                
//                 irTelaInicial();
//                 document.querySelector('.inicial').addEventListener('click', function (event) {
//                     event.preventDefault(); // Evita o comportamento padrão do formulário
                    
//                     window.location.href = "TelaInicial.html";
//                 });
//             } else if (response.status === 403) {
//                 // CPF já cadastrado
//                 // alert("Usuário/senha inválido!");
//                 loginInvalido()
//             }
//         })
//         .catch(e => {
//             console.log(e)
//             // Exibe mensagem de erro em caso de falha na requisição
//             //console.error('Erro ao acessar usuário:', error);
//             alert("Erro ao acessar usuário. Por favor, tente novamente.");
//             // erroLogin()
//         });
// }

document.querySelector('.btn-login').addEventListener('click', function (event) {
    event.preventDefault();
    validarCampos();
    consultar();
});

function limparCampos() {
    document.querySelector(".card-login").reset();
}

function irTelaInicial(){
    const modal = document.querySelector('.cartao');

    // Função para abrir o modal
    const openModal = () => {
        modal.style.display = 'flex';
    };

    // Quando o usuário clicar no botão, abre o modal
    openModal()
}



function loginInvalido() {
    const modal = document.querySelector('#not-valid');
    const btnOk = document.querySelector('#clicked'); 

    // Função para abrir o modal
    const openModal = () => {
        modal.style.display = 'flex';
    };

    // Função para fechar o modal
    const closeModal = () => {
        modal.style.display = 'none';
    };

    // Abre o modal
    openModal();

    // Adiciona o evento de clique ao botão 'btnOk'
    if (btnOk) {
        btnOk.addEventListener('click', (event) => {
            console.log("Botão OK clicado");
            closeModal();
        });
    } else {
        console.error("Elemento '.inicial' não encontrado.");
    }

    // Adiciona evento para fechar o modal ao clicar fora dele
    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            closeModal();
        }
    });
}