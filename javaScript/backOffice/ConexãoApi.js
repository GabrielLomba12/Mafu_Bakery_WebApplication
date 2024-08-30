async function fetchUserData() {
    try {
        const response = await fetch('http://localhost:8080/api/usuario');
        const users = await response.json();

        const tableBody = document.querySelector('#userTable tbody');
        tableBody.innerHTML = ''; // Limpa qualquer dado anterior

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
            cellGrupo.textContent = user.permissao
            row.appendChild(cellGrupo)

            const cellEditar = document.createElement('td');
            const editLink = document.createElement('a');
            editLink.href = `./AlterarUsuario/${user.id}`; // Caminho para a página de edição com o ID do usuário
            editLink.textContent = 'Editar';
            cellEditar.appendChild(editLink);
            row.appendChild(cellEditar);

            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Erro ao buscar os dados dos usuários:', error);
    }
}

document.getElementById('listarUsuarios').addEventListener('click', fetchUserData);