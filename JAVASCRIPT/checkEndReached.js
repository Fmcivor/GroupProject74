document.addEventListener('DOMContentLoaded', function() {
    let loggedIn = checkLoggedIn();
    if(loggedIn == true){
        let check = !window.location.href.includes("endGameLoss.html")
        if (!(window.location.href.includes("gameLostStats.html") || 
            window.location.href.includes("gameWonStats.html") ||
            window.location.href.includes("endGameLoss.html") ||
            window.location.href.includes("endGameWin.html")) ) {
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