const frete = localStorage.getItem('valorFrete');
const subtotal = localStorage.getItem('valorProdutos') || 'R$ 0.00';
const totalPedido = localStorage.getItem('valorTotalPedido') || 'R$ 0.00';

document.addEventListener('DOMContentLoaded', function () {

    document.getElementById('frete').innerText = "Frete: " + frete;
    document.getElementById('valor-produtos').innerText = "Subtotal: " + subtotal;
    document.getElementById('valor-total-pedido').innerText = "Total do pedido: " + totalPedido;

    const pixCheckbox = document.getElementById('pix');
    const creditCheckbox = document.getElementById('credito');

    if (pixCheckbox.checked) {
        togglePaymentMethod('pix');
    } else if (creditCheckbox.checked) {
        togglePaymentMethod('credito');
    }

    document.getElementById('btn-avancar').addEventListener('click', function (event) {
        if (creditCheckbox.checked) {
            if (!validateCreditCardFields()) {
                alert("Por favor, preencha todos os campos obrigatórios do cartão de crédito.");
                event.preventDefault();  
                return;  
            }
        }

        const selectedPaymentMethod = pixCheckbox.checked ? 'pix' : 'credito';
        localStorage.setItem('metodoPagamento', selectedPaymentMethod);
        console.log(selectedPaymentMethod)
        window.location.href = "TelaResumoPedido.html"
    });

    document.getElementById('btn-voltar').addEventListener('click', function(){
        window.location.href = "TelaCheckout.html"
    });
});

function togglePaymentMethod(selectedMethod) {
    const pixCard = document.getElementById('pixCard');
    const creditCard = document.getElementById('creditCard');
    const pixCheckbox = document.getElementById('pix');
    const creditCheckbox = document.getElementById('credito');

    if (selectedMethod === 'pix') {
        pixCheckbox.checked = true;
        creditCheckbox.checked = false;
        pixCard.style.display = 'block';
        creditCard.style.display = 'none'; 
    }

    else if (selectedMethod === 'credito') {
        creditCheckbox.checked = true; 
        pixCheckbox.checked = false; 
        creditCard.style.display = 'block'; 
        pixCard.style.display = 'none'; 
    }
}

function validateCreditCardFields() {
    const cardName = document.getElementById('cardName');
    const cardNumber = document.getElementById('cardNumber');
    const cardExpiry = document.getElementById('cardExpiry');
    const cardCvv = document.getElementById('cardCvv');
    const parcelas = document.getElementById('parcelas');

    return cardName.value.trim() !== '' &&
        cardNumber.value.trim() !== '' &&
        cardExpiry.value.trim() !== '' &&
        cardCvv.value.trim() !== '' &&
        parcelas.value !== '';
}
