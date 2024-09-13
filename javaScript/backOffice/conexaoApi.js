// var API = "4.228.231.149"; //Setar essa variavel quando subir para a nuvem e comentar a localhost
var API = "localhost"; //Setar essa variavel quando testar local e comentar a do IP

const emailUsuario = localStorage.getItem("email");
const token = localStorage.getItem("tokenAcesso");
buscarUsuario(emailUsuario);

document.getElementById('btn-usuario').addEventListener('click', () => {
    document.getElementById('tabela-de-ingrediente').style.display = 'none';
    document.getElementById('filtro-ingrediente').style.display = 'none';
    document.getElementById('tabela-de-usuario').style.display = 'flex';
    document.getElementById('filtro-usuario').style.display = 'flex';
    fetchUserData();
});

document.getElementById('btn-ingrediente').addEventListener('click', () => {
    document.getElementById('tabela-de-usuario').style.display = 'none';
    document.getElementById('filtro-usuario').style.display = 'none';
    document.getElementById('tabela-de-ingrediente').style.display = 'flex';
    document.getElementById('filtro-ingrediente').style.display = 'flex';
    fetchIngredienteData();
});

async function fetchUserData() {
    try {
        const response = await fetch(`http://${API}:8080/api`, {
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
            if(user.isEnabled) {
                cellStatus.textContent = 'Ativo';
            } else 
                cellStatus.textContent = 'Inativo';
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

function formatarCasasDecimais(numero) {
    return Number(numero).toFixed(2);
}

async function fetchIngredienteData() {
    try {
        const response = await fetch(`http://${API}:8080/api/mp`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        const ingredientes = await response.json();

        const tableBody = document.querySelector('#ingredienteTable tbody');
        tableBody.innerHTML = '';

        ingredientes.forEach(ingrediente => {
            const row = document.createElement('tr');

            const cellNome = document.createElement('td');
            cellNome.textContent = ingrediente.nome;
            row.appendChild(cellNome);

            const cellEstoque = document.createElement('td');
            cellEstoque.textContent = ingrediente.quantidadeEstoque;
            row.appendChild(cellEstoque);

            const cellPreco = document.createElement('td');
            cellPreco.textContent = 'R$ ' + formatarCasasDecimais(ingrediente.preco);
            row.appendChild(cellPreco);

            const cellStatus = document.createElement('td');
            if (ingrediente.status) {
                cellStatus.textContent = 'Ativo';
            } else 
                cellStatus.textContent = 'Inativo'
            row.appendChild(cellStatus);

            const cellEditar = document.createElement('td');
            const editLink = document.createElement('a');
            editLink.href = `../cadastroIngrediente.html?id=${ingrediente.id}`;
            editLink.textContent = 'Editar';
            cellEditar.appendChild(editLink);
            row.appendChild(cellEditar);

            const cellAtivar_Desativar = document.createElement('td');
            const href_putStatus = document.createElement('a');
            href_putStatus.href = '#';
            href_putStatus.textContent = 'Ativar/Desativar';
            href_putStatus.addEventListener('click', () => {
                document.querySelector("#card-modal").style.display = "flex";
                document.querySelector("#btnsim").setAttribute('data-user-id', ingrediente.id);
            });
            cellAtivar_Desativar.appendChild(href_putStatus);
            row.appendChild(cellAtivar_Desativar);

            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Erro ao buscar os dados dos ingredientes:', error);
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
                    'Content-Type': 'application/json',
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
    fetch(`http://` + API + `:8080/api/usuarioLogado?email=${email}`, {
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
            document.getElementById("login_user").innerHTML = "Olá, " + primeiroNome + ' (' + data.permissao + ')';

            // Adicionando links de funções baseados na permissão do usuário
            const funcoes = document.querySelector(".funcoes");

            // if (data.permissao === 'ADMINISTRADOR') {
            //     adicionarLink(funcoes, "#listarUsuarios", "Listar Usuários  ", fetchUserData);
            //     adicionarLink(funcoes, "#listarProdutos", "Listar Produtos");
            //     adicionarLink(funcoes, "#listarIngredientes", "Listar Ingredientes");
            //     adicionarLink(funcoes, "#listarPedidos", "Listar Pedidos");
            // }

            // if (data.permissao === 'ESTOQUISTA') {
            //     adicionarLink(funcoes, "#listarPedidos", "Listar Pedidos");
            //     adicionarLink(funcoes, "#listarProdutos", "Listar Produtos");
            //     adicionarLink(funcoes, "#listarIngredientes", "Listar Ingredientes");
            // }
        })
        .catch(error => {
            console.error('Erro ao fazer login:', error);
            alert("Erro ao acessar usuário. Por favor, tente novamente.");
        });

    // function adicionarLink(container, href, texto, clickHandler = null) {
    //     let link = document.createElement("a");
    //     link.href = href;
    //     link.textContent = texto;

    //     if (clickHandler) {
    //         link.addEventListener('click', (event) => {
    //             event.preventDefault();
    //             clickHandler();
    //         });
    //     }

    //     container.appendChild(link);
    // }
}