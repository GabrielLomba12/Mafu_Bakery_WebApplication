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