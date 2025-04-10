//check if user has jumped to the end
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

//check if logged in
function checkLoggedIn(){
    if (!sessionStorage.getItem('userID')) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

document.getElementById('backToMenuBtn').addEventListener('click', function() {
    window.location.replace('mainMenu.html');
})