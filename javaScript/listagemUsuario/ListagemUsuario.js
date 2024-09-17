// var API = "4.228.231.149"; //Setar essa variavel quando subir para a nuvem e comentar a localhost
var API = "localhost"; //Setar essa variavel quando testar local e comentar a do IP

const emailUsuario = localStorage.getItem("email");
var token = localStorage.getItem("tokenAcesso");
var permissao = localStorage.getItem("permissao")

document.addEventListener('DOMContentLoaded', () => {
    fetchUsuarioData();
});

async function fetchUsuarioData() {
    try {
        const response = await fetch(`http://${API}:8080/api`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        const usuarios = await response.json();
        preencherTabela(usuarios);
    } catch (error) {
        console.error("Erro ao buscar usuários:", error);
    }
}

function preencherTabela(usuarios) {
    const tabela = document.querySelector('.divTable');

        tabela.innerHTML = `
        <div class="tabela" id="tabela-de-usuario"> 
            <table border="1" class="estilo-tabela" id="userTable">
                <thead> 
                    <tr>       
                        <th>Nome</th>
                        <th>E-mail</th>
                        <th>Status</th>
                        <th>Permissão</th>
                        <th class="acao">Alterar</th>
                        <th class="acao">Ativar/Desativar</th>
                    </tr>
                </thead>
                <tbody id="table-body">
                </tbody>
            </table>
        </div>`;

    const tbody = document.querySelector("tbody");
    tbody.innerHTML = "";

    usuarios.forEach(usuario => {
        
        const tr = document.createElement("tr");
        tr.innerHTML = 
        `<td>${usuario.nome}</td>
        <td>${usuario.email}</td>
        <td>${usuario.status ? 'Inativo' : 'Ativo'}</td>
        <td>${usuario.permissao}</td>
        <td class="acao"><button onclick="enviarParaAlteracao(${usuario.id})" id="alterar">Alterar</button></td>
        <td class="acao"><button>Ativar/Desativar</button></td>`;
        tbody.appendChild(tr);
    });
}

function enviarParaAlteracao(id) {
    window.location.href = `../cadastroUsuario.html?id=${id}`
}

function redirecionarCadastroUsuario() {
    window.location.href = "cadastroUsuario.html";
}