// var API = "4.228.231.149"; //Setar essa variavel quando subir para a nuvem e comentar a localhost
var API = "localhost"; //Setar essa variavel quando testar local e comentar a do IP

var token = localStorage.getItem("tokenAcesso");

function filtrarProdutos() {
    // Obtém o valor digitado no campo de entrada e remove espaços extras
    var filtro = document.getElementById('filtro').value.trim().toUpperCase();

    // Se o filtro estiver vazio, busca os produtos normalmente
    if (!filtro) {
        fetchProdutoData(); // Carrega a lista completa se o filtro estiver vazio
        return;
    }

    async function fetchFilteredData(page = 0) {
        try {
            const response = await fetch(`http://${API}:8080/api/produtos/buscarNome?nome=${filtro}&page=${page}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            // Se a API retornar 404, exibe a mensagem de produto não encontrado
            if (response.status === 404) {
                alert('erro de conexão com a API')
                return;
            }

            const result = await response.json();
            if (result.produtos.length === 0) {
                // Caso a lista de produtos retornada seja vazia, exibe mensagem de produto não encontrado
                alert("Produto não encontrado")
            } else {
                data = result.produtos; // Armazena os produtos filtrados
                totalPages = result.totalPages; // Armazena o número total de páginas para os produtos filtrados
                displayTableData(); // Exibe os dados filtrados
                setupPagination(); // Configura a paginação para os dados filtrados
            }
        } catch (error) {
            console.error('Erro ao buscar dados filtrados:', error);
        }
    }

    fetchFilteredData(); // Chama a função para buscar os produtos filtrados
}
