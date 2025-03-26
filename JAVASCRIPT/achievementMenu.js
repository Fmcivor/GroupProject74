document.addEventListener("DOMContentLoaded", function () {
    document.getElementById('usernameDisplay').textContent = sessionStorage.getItem("username");
});