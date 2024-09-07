// var API = "4.228.231.149"; //Setar essa variavel quando subir para a nuvem e comentar a localhost
var API = "localhost"; //Setar essa variavel quando testar local e comentar a do IP
let emailUsuario = localStorage.getItem("email")
let token = localStorage.getItem("tokenAcesso")
buscarUsuario(emailUsuario);

async function fetchUserData() {
    try {
        const response = await fetch('http://'+API+':8080/api', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        const users = await response.json();

        const tableBody = document.querySelector('#userTable tbody');
        tableBody.innerHTML = '';

        users.forEach(user => {
            const row = document.createElement('tr');

            const cellNome = document.createElement('td');
            cellNome.textContent = user.nome;
            row.appendChild(cellNome);

            const cellEmail = document.createElement('td');
            cellEmail.textContent = user.email;
            row.appendChild(cellEmail);

            const cellStatus = document.createElement('td');
            cellStatus.textContent = user.isEnabled;
            row.appendChild(cellStatus);

            const cellGrupo = document.createElement('td');
            cellGrupo.textContent = user.permissao;
            row.appendChild(cellGrupo);

            const cellEditar = document.createElement('td');
            const editLink = document.createElement('a');
            editLink.href = `../cadastroUsuario.html?id=${user.id}`;
            editLink.textContent = 'Editar';
            cellEditar.appendChild(editLink);
            row.appendChild(cellEditar);

            const cellAtivar_Desativar = document.createElement('td');
            const href_putStatus = document.createElement('a');
            href_putStatus.href = '#';
            href_putStatus.textContent = 'Ativar/Desativar';
            href_putStatus.addEventListener('click', () => {
                document.querySelector("#card-modal").style.display = "flex";
                document.querySelector("#btnsim").setAttribute('data-user-id', user.id);
            });
            cellAtivar_Desativar.appendChild(href_putStatus);
            row.appendChild(cellAtivar_Desativar);

            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Erro ao buscar os dados dos usuários:', error);
    }
}



document.querySelector("#btnsim").addEventListener('click', async (event) => {
    event.preventDefault();
        try {
            const userId = document.querySelector("#btnsim").getAttribute('data-user-id');
            const response = 
            await fetch(`http://`+API+`:8080/api/ativaDesativaUsuario?id=${userId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                fetchUserData();
                document.querySelector("#card-modal").style.display = "none";
            } else {
                alert('Falha ao alterar o status do usuário.');
            }
            } catch (error) {
                console.error('Erro na requisição:', error);
                alert('Ocorreu um erro ao tentar alterar o status do usuário.');
            }
});

document.querySelector("#btnnao").addEventListener('click', () => {
    document.querySelector("#card-modal").style.display = "none";
});

function redirecionar() {
    window.location.href = "cadastroUsuario.html";
}


const funcoes = document.querySelector(".funcoes")
let link = document.createElement("a")
let usuarioLogadoId;

function buscarUsuario(email) {
    fetch(`http://`+API+`:8080/api/usuarioLogado?email=${email}`, {
        method: 'GET',
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Erro ao fazer login');
        }
    })
    .then(data => {
        usuarioLogadoId = data.id;

        let nome = "";
        nome = data.nome;
        let palavras = nome.split(" ");
        let primeiroNome = palavras[0];
        document.getElementById("login_user").innerHTML = "Olá, " + primeiroNome + ' ('+data.permissao+')';

            // Adicionando links de funções baseados na permissão do usuário
            const funcoes = document.querySelector(".funcoes");

            if (data.permissao === 'ADMINISTRADOR') {
                adicionarLink(funcoes, "#listarUsuarios", "Listar Usuários  ", fetchUserData);
                adicionarLink(funcoes, "#listarProdutos", "Listar Produtos");
            }
    
            if (data.permissao === 'ESTOQUISTA' || data.permissao === 'ADMINISTRADPR') {
                adicionarLink(funcoes, "#listarPedidos", "Listar Pedidos");
                adicionarLink(funcoes, "#listarProdutos", "Listar Produtos");
            }
    })
    .catch(error => {
        console.error('Erro ao fazer login:', error);
        alert("Erro ao acessar usuário. Por favor, tente novamente.");
    });

    function adicionarLink(container, href, texto, clickHandler = null) {
        let link = document.createElement("a");
        link.href = href;
        link.textContent = texto;
        
        if (clickHandler) {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                clickHandler();
            });
        }
    
        container.appendChild(link);
    }
}