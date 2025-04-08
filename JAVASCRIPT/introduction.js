document.getElementById("startGame").addEventListener("click", async function() {
    let validUser = checkLogin();
    if (validUser == false) {
        window.location.replace('login.html');
        return;
    }
    sessionStorage.setItem("currentRoom", 'OutsideHouse.html');
    sessionStorage.setItem("currentState", 1);
    await updateRoomVisits();
    window.location.replace('OutsideHouse.html');
    sessionStorage.setItem('gameSessionStartTime',Date.now());
});

document.getElementById("exit").addEventListener("click", function() {
    window.location.replace('mainMenu.html');
});