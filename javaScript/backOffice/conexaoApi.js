var API = "4.228.231.149"; //Setar essa variavel quando subir para a nuvem e comentar a localhost
// var API = "localhost"; //Setar essa variavel quando testar local e comentar a do IP

async function fetchUserData() {
    try {
        const response = await fetch('http://'+API+':8080/api');
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
            editLink.href = `./AlterarUsuario/${user.id}`;
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