document.getElementById("startGame").addEventListener("click", async function() {
    let validUser = checklogin();
    if (validUser == false) {
        window.location.replace('login.html');
        return;
    }
    sessionStorage.setItem("currentRoom", 'OutsideHouse.html');
    sessionStorage.setItem("currentState", 1);
    await updateRoomVisits();
    window.location.replace('OutsideHouse.html');
});