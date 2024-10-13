document.addEventListener('DOMContentLoaded', () => {

    const modalUsuario = document.querySelector('#cartao-usuario');
    const modalSenha = document.querySelector('#cartao-senha');
    const modalEndereco = document.querySelector('#cartao-endereco');

    const closeBtns = document.querySelectorAll('.close');
    const cancelarBtns = document.querySelectorAll('.cancelar');

    const openBtn = document.querySelector('#botao-usuario');
    const openSenha = document.querySelector('#botao-senha');

    function limparCampos() {
        document.querySelectorAll(".input-dados").forEach(input => {
            input.value = "";
        });
    }

    const openModalUsuario = () => {
        modalUsuario.style.display = 'flex';

    };

    const openModalSenha = () => {
        modalSenha.style.display = 'flex';
    };

    const closeModalUsuario = () => {
        modalUsuario.style.display = 'none';
        limparCampos()
    };

    const closeModalEndereco = () => {
        modalEndereco.style.display = 'none';
        limparCampos()
    };

    const closeModalSenha = () => {
        modalSenha.style.display = 'none';
        limparCampos()
    };

    openBtn.addEventListener('click', openModalUsuario);
    openSenha.addEventListener('click', openModalSenha);

    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            closeModalUsuario();
            closeModalSenha();
            closeModalEndereco();
        });
    });

    cancelarBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            closeModalUsuario();
            closeModalSenha();
            closeModalEndereco();
        });
    });
});
