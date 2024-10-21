
function validateForm() {
    let isValid = true;

    // Validar Nome
    const nomeInput = document.getElementById("nome");
    const nomeError = document.getElementById("nomeError");
    const nomeValue = nomeInput.value.trim();
    const nomeWords = nomeValue.split(" ");
    nomeInput.classList.remove("is-invalid");
    nomeError.style.display = "none";

    if (
        nomeWords.length < 2 ||
        nomeWords.some((word) => word.length < 3)
    ) {
        nomeInput.classList.add("is-invalid");
        nomeError.style.display = "block";
        isValid = false;
    }

    // Validar CPF
    const cpfInput = document.getElementById("cpf");
    const cpfError = cpfInput.nextElementSibling;
    const cpfValue = cpfInput.value.trim();
    cpfInput.classList.remove("is-invalid");
    cpfError.style.display = "none";

    const cpfPattern = /^\d{11}$/; // Apenas 11 dígitos numéricos
    if (!cpfPattern.test(cpfValue)) {
        cpfInput.classList.add("is-invalid");
        cpfError.style.display = "block";
        isValid = false;
    }

    // Validar Data de Nascimento
    const dataNascimentoInput = document.getElementById("data_nascimento");
    const dataNascimentoError = document.getElementById("dataNascimentoError");
    const dataNascimentoValue = dataNascimentoInput.value;
    dataNascimentoInput.classList.remove("is-invalid");
    dataNascimentoError.style.display = "none";

    if (!dataNascimentoValue) {
        dataNascimentoInput.classList.add("is-invalid");
        dataNascimentoError.style.display = "block";
        isValid = false;
    }

    // Validar Gênero
    const generoInput = document.getElementById("genero");
    const generoError = generoInput.nextElementSibling;
    const generoValue = generoInput.value;
    generoInput.classList.remove("is-invalid");
    generoError.style.display = "none";

    if (!generoValue) {
        generoInput.classList.add("is-invalid");
        generoError.style.display = "block";
        isValid = false;
    }

    // Validar Email
    const emailInput = document.getElementById("email");
    const emailError = emailInput.nextElementSibling;
    const emailValue = emailInput.value.trim();
    emailInput.classList.remove("is-invalid");
    emailError.style.display = "none";

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailValue)) {
        emailInput.classList.add("is-invalid");
        emailError.style.display = "block";
        isValid = false;
    }

    // Validar Senha
    const senhaInput = document.getElementById("senha");
    const senhaError = senhaInput.nextElementSibling;
    const senhaValue = senhaInput.value.trim();
    senhaInput.classList.remove("is-invalid");
    senhaError.style.display = "none";

    if (senhaValue.length < 5) {
        senhaInput.classList.add("is-invalid");
        senhaError.style.display = "block";
        isValid = false;
    }

    // Retorna verdadeiro se todos os campos forem válidos
    return isValid;
}

