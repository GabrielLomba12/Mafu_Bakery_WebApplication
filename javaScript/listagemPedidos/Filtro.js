function filtrarPedidos() {
    var filtro = document.getElementById('filtro').value.toUpperCase();

    var pedidos = document.querySelectorAll("tbody tr");

    pedidos.forEach(pedidos => {
        var statusPedido = pedidos.querySelector("td:nth-child(4)").innerText.toUpperCase();

        if (statusPedido.includes(filtro)) {
            pedidos.style.display = ""; 
        } else {
            pedidos.style.display = "none";
        }
    });
}