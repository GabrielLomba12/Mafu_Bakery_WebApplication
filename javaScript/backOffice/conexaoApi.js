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
                'Authorization': `Bearer ${token}`
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
            editLink.href = `../cadastroUsuario.html`;
            editLink.textContent = 'Editar';
            cellEditar.appendChild(editLink);
            row.appendChild(cellEditar);

            const cellAtivar_Desativar = document.createElement('td');
            const href_putStatus = document.createElement('a');
            href_putStatus.href = '#';
            href_putStatus.textContent = 'Ativar/Desativar';
            href_putStatus.addEventListener('click', async (event) => {
                event.preventDefault();

                try {
                    const response = 
                    await fetch(`http://`+API+`:8080/api/ativaDesativaUsuario?id=${user.id}`, {
                        method: 'PUT',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (response.ok) {
                        alert('Status do usuário alterado com sucesso!');
                    } else {
                        alert('Falha ao alterar o status do usuário.');
                    }
                } catch (error) {
                    console.error('Erro na requisição:', error);
                    alert('Ocorreu um erro ao tentar alterar o status do usuário.');
                }
            });
            cellAtivar_Desativar.appendChild(href_putStatus);
            row.appendChild(cellAtivar_Desativar);

            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Erro ao buscar os dados dos usuários:', error);
    }
}

document.getElementById('listarUsuarios').addEventListener('click', fetchUserData);

async function fetchUserDataNome() {
    try {
        const nome = document.querySelector('.nome')
        const response = await fetch('http://'+API+':8080/api/usuariosPorPesquisa?nome=${nome}', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
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
            editLink.href = `../cadastroUsuario.html`;
            editLink.textContent = 'Editar';
            cellEditar.appendChild(editLink);
            row.appendChild(cellEditar);

            const cellAtivar_Desativar = document.createElement('td');
            const href_putStatus = document.createElement('a');
            href_putStatus.href = '#';
            href_putStatus.textContent = 'Ativar/Desativar';
            href_putStatus.addEventListener('click', async (event) => {
                event.preventDefault();

                try {
                    const response = 
                    await fetch(`http://`+API+`:8080/api/ativaDesativaUsuario?id=${user.id}`, {
                        method: 'PUT',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (response.ok) {
                        alert('Status do usuário alterado com sucesso!');
                    } else {
                        alert('Falha ao alterar o status do usuário.');
                    }
                } catch (error) {
                    console.error('Erro na requisição:', error);
                    alert('Ocorreu um erro ao tentar alterar o status do usuário.');
                }
            });
            cellAtivar_Desativar.appendChild(href_putStatus);
            row.appendChild(cellAtivar_Desativar);

            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Erro ao buscar os dados dos usuários:', error);
    }
}

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
        let nome = "";
        nome = data.nome;
        let palavras = nome.split(" ");
        let primeiroNome = palavras[0];
        document.getElementById("login_user").innerHTML = "Olá, " + primeiroNome + ' ('+data.permissao+')';
    })
    .catch(error => {
        console.error('Erro ao fazer login:', error);
        alert("Erro ao acessar usuário. Por favor, tente novamente.");
    });
}