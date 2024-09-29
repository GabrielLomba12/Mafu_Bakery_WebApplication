const emailUsuario = localStorage.getItem("email")

const opcoes = document.querySelector('.burger-menu');
if(emailUsuario) {
    

    opcoes.innerHTML = 
    `
        <a href="#perfil">Perfil</a>
        <a href="#pedidos">Meus Pedidos</a>
        <a href="#logout">Logout</a>
    `;
} else {
    opcoes.innerHTML = ``;

    opcoes.innerHTML = 
    `
        <a href="Login.html">Login</a>
    `;
}