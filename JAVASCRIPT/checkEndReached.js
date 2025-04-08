document.addEventListener('DOMContentLoaded', function() {
    if (!window.location.href.includes(sessionStorage.getItem("currentRoom"))) {
        window.location.replace(sessionStorage.getItem("currentRoom"));
    }
});