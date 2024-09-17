function filtrarProdutos() {
    var filtro = document.getElementById('filtro').value.toUpperCase();
 
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