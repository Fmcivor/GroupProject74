document.getElementById("startGame").addEventListener("click", async function() {
    
    sessionStorage.setItem("currentRoom", 'OutsideHouse.html');
    sessionStorage.setItem("currentState", 1);
    await updateRoomVisits();
    window.location.replace('OutsideHouse.html');
});