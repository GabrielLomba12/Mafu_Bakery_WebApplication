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

let selectedUserId = null; 
let selectedToggleState = null; 

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
        <td>${usuario.isEnabled ? 'Ativo' : 'Inativo'}</td>
        <td>${usuario.permissao}</td>
        <td class="acao"><button onclick="enviarParaAlteracao(${usuario.id})" id="alterar">Alterar</button></td>
        <td class="acao">
            <label class="switch">
                <input type="checkbox" id="toggle-btn-${usuario.id}" ${usuario.isEnabled ? 'checked' : ''} 
                onclick="exibirModal(${usuario.id}, this.checked)">
                <span class="slider"></span>
            </label>
        </td>`;
        tbody.appendChild(tr);
    });
}

function alterarStatusUsuario(userId, isEnabled) {
    fetch(`http://${API}:8080/api/ativaDesativaUsuario?id=${userId}&status=${isEnabled}`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            fetchUsuarioData();
            fecharModal();
        } else {
            alert('Falha ao alterar o status do usuário.');
        }
    })
    .catch(error => {
        console.error('Erro na requisição:', error);
        alert('Ocorreu um erro ao tentar alterar o status do usuário.');
        fecharModal(); 
    });
}

function exibirModal(userId, isEnabled) {
    selectedUserId = userId; 
    selectedToggleState = isEnabled; 

    document.querySelector("#card-modal").style.display = "flex";

    document.querySelector("#btnsim").onclick = function() {
        alterarStatusUsuario(selectedUserId, selectedToggleState);
    };
    document.querySelector("#btnnao").onclick = function() {
        fecharModal(); 
        const toggle = document.querySelector(`#toggle-btn-${selectedUserId}`);
        toggle.checked = !selectedToggleState;
    };
}

function fecharModal() {
    document.querySelector("#card-modal").style.display = "none";
}

function enviarParaAlteracao(id) {
    window.location.href = `../cadastroUsuario.html?id=${id}`
}

function redirecionarCadastroUsuario() {
    window.location.href = "cadastroUsuario.html";
}