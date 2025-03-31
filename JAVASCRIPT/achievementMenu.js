document.addEventListener("DOMContentLoaded", function () {
    checkLogin();
    document.getElementById('usernameDisplay').textContent = sessionStorage.getItem("username");
});