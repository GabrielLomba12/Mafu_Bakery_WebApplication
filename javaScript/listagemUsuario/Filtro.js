function filtrarUsuarios() {
    var filtro = document.getElementById('filtro').value.toUpperCase();

    var usuarios = document.querySelectorAll("tbody tr");

    usuarios.forEach(usuarios => {
        var nomeUsuario = usuarios.querySelector("td:first-child").innerText.toUpperCase();

        if (nomeUsuario.includes(filtro)) {
            usuarios.style.display = ""; 
        } else {
            usuarios.style.display = "none";
        }
    });
}
