
const subtotal = localStorage.getItem('valorProdutos') || 'R$ 0.00';
const totalPedido = localStorage.getItem('valorTotalPedido') || 'R$ 0.00';

document.addEventListener('DOMContentLoaded', function() {
  

    document.getElementById('valor-produtos').innerText = subtotal;
    document.getElementById('valor-total-pedido').innerText = totalPedido;

      // Verifica qual método de pagamento está selecionado e exibe o card correspondente
      const pixCheckbox = document.getElementById('pix');
      const creditCheckbox = document.getElementById('credito');
  
      if (pixCheckbox.checked) {
          togglePaymentMethod('pix');
      } else if (creditCheckbox.checked) {
          togglePaymentMethod('credito');
      }
});

function togglePaymentMethod(selectedMethod) {
    const pixCard = document.getElementById('pixCard');
    const creditCard = document.getElementById('creditCard');
    const pixCheckbox = document.getElementById('pix');
    const creditCheckbox = document.getElementById('credito');

    if (selectedMethod === 'pix') {
        pixCheckbox.checked = true; // Marca o checkbox do PIX
        creditCheckbox.checked = false; // Desmarca o checkbox do Cartão de Crédito
        pixCard.style.display = 'block'; // Mostra o card do PIX
        creditCard.style.display = 'none'; // Esconde o card do Cartão de Crédito
    } 
    // Se o método selecionado for Cartão de Crédito
    else if (selectedMethod === 'credito') {
        creditCheckbox.checked = true; // Marca o checkbox do Cartão de Crédito
        pixCheckbox.checked = false; // Desmarca o checkbox do PIX
        creditCard.style.display = 'block'; // Mostra o card do Cartão de Crédito
        pixCard.style.display = 'none'; // Esconde o card do PIX
    }
}
