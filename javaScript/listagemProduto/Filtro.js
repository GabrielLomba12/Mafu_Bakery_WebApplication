
// var API = "4.228.231.149"; //Setar essa variavel quando subir para a nuvem e comentar a localhost
var API = "localhost"; //Setar essa variavel quando testar local e comentar a do IP

var token = localStorage.getItem("tokenAcesso");

function filtrarProdutos() {
    var filtro = document.getElementById('filtro').value.trim().toUpperCase();

    if (!filtro) {
        fetchProdutoData();
        return;
    }

    async function fetchFilteredData(page = 0) {
        try {
            const response = await fetch(`http://${API}:8080/api/produtos/buscarNome?nome=${filtro}&page=${page}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.status === 404) {
                alert('erro de conexão com a API')
                return;
            }

            const result = await response.json();
            if (result.produtos.length === 0) {
                alert("Produto não encontrado")
            } else {
                data = result.produtos; 
                totalPages = result.totalPages;
                displayTableData(); 
                setupPagination(); 
            }
        } catch (error) {
            console.error('Erro ao buscar dados filtrados:', error);
        }
    }

    fetchFilteredData(); 
}
