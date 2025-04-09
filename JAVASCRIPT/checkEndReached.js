document.addEventListener('DOMContentLoaded', function() {
    let loggedIn = checkLoggedIn();
    if(loggedIn == true){
        if (!window.location.href.includes(sessionStorage.getItem("currentRoom"))) {
            window.location.replace(sessionStorage.getItem("currentRoom"));
        }
    }
});

function checkLoggedIn(){
    if (!sessionStorage.getItem('userID')) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}