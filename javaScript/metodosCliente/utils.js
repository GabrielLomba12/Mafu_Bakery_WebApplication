function mostrarLoading() {
    document.getElementById("loadingModal").style.display = "block";
    document.querySelector(".container").classList.add('blur');
}

function esconderLoading() {
    document.getElementById("loadingModal").style.display = "none";
}