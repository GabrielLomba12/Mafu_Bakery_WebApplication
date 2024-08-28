// const listarUsuarios = () => {
//     fetch('http://localhost:8080/api/usuario', {
//         method: 'GET',
//     })
//     .then(response => {
//         if (response.ok) {
//             return console.log(response.json());
//         } else {
//             throw new Error('Erro ao buscar os usuários');
//         }
//     })
//     .then(usuarios => {
//         if (!Array.isArray(usuarios)) {
//             throw new Error('A resposta não é um array de usuários');
//         }
//         const tabela = document.getElementById('tabelaUsuarios').getElementsByTagName('tbody')[0];

//         usuarios.forEach(usuario => {
//             let novaLinha = tabela.insertRow();

//             let celulaId = novaLinha.insertCell(0);
//             let celulaNome = novaLinha.insertCell(1);
//             let celulaCpf = novaLinha.insertCell(2);

//             celulaId.textContent = usuario.id;
//             celulaNome.textContent = usuario.nome;
//             celulaCpf.textContent = usuario.cpf;
//         });
//     })
//     .catch(error => {
//         console.error('Erro:', error);
//     });
// }

async function fetchUserData() {
    try {
        const response = await fetch('http://localhost:8080/api/usuario');
        const users = await response.json();

        const tableBody = document.querySelector('#userTable tbody');
        tableBody.innerHTML = ''; // Limpa qualquer dado anterior

        users.forEach(user => {
            const row = document.createElement('tr');

            const cellId = document.createElement('td');
            cellId.textContent = user.id;
            row.appendChild(cellId);

            const cellName = document.createElement('td');
            cellName.textContent = user.nome;
            row.appendChild(cellName);

            const cellCpf = document.createElement('td');
            cellCpf.textContent = user.cpf;
            row.appendChild(cellCpf);

            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Erro ao buscar os dados dos usuários:', error);
    }
}

// Chama a função para buscar e exibir os dados
document.getElementById('listarUsuarios').addEventListener('click', fetchUserData);

// const listarProd = () => {
//     fetch('http://localhost:8080/api/usuario', {
//         method: 'GET',
//     })
//     .then(response => {
//         if (response.ok) {
//             return response.json();
//         } else {
//             throw new Error('Erro ao buscar os usuários');
//         }
//     })
//     .then(usuarios => {
//         if (!Array.isArray(usuarios)) {
//             throw new Error('A resposta não é um array de usuários');
//         }

//         const tabela = document.getElementById('tabelaUsuarios').getElementsByTagName('tbody')[0];

//         // Limpa a tabela antes de adicionar novas linhas
//         tabela.innerHTML = '';

//         usuarios.forEach(usuario => {
//             let novaLinha = tabela.insertRow();

//             let celulaId = novaLinha.insertCell(0);
//             let celulaNome = novaLinha.insertCell(1);
//             let celulaCpf = novaLinha.insertCell(2);

//             celulaId.textContent = usuario.id;
//             celulaNome.textContent = usuario.nome;
//             celulaCpf.textContent = usuario.cpf;
//         });
//     })
//     .catch(error => {
//         console.error('Erro:', error);
//     });
// }
