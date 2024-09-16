function filtrarUsuarios() {
    var filtro = document.getElementById('user').value.toUpperCase();
 
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

function filtrarIngredientes() {
    var filtro = document.getElementById('ingrediente').value.toUpperCase();
 
    var ingredientes = document.querySelectorAll("tbody tr");
  
    ingredientes.forEach(ingredientes => {
        var nomeIngrediente = ingredientes.querySelector("td:first-child").innerText.toUpperCase();

        if (nomeIngrediente.includes(filtro)) {
            ingredientes.style.display = ""; 
        } else {
            ingredientes.style.display = "none";
        }
    });
}

function filtrarProdutos() {
    var filtro = document.getElementById('produto').value.toUpperCase();
 
    var produtos = document.querySelectorAll("tbody tr");
  
    produtos.forEach(produtos => {
        var nomeProduto = produtos.querySelector("td:nth-child(2)").innerText.toUpperCase();

        if (nomeProduto.includes(filtro)) {
            produtos.style.display = ""; 
        } else {
            produtos.style.display = "none";
        }
    });
}