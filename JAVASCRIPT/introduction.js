const nextRoomID = 1;
let gameID = sessionStorage.getItem("gameID");


document.getElementById("startGame").addEventListener("click", async function() {
    let validUser = checkLogin();
    if (validUser == false) {
        window.location.replace('login.html');
        return;
    }
    sessionStorage.setItem("currentRoom", 'OutsideHouse.html');
    sessionStorage.setItem("currentState", 1);
    addRoomVisit();
    window.location.replace('OutsideHouse.html');
    sessionStorage.setItem('gameSessionStartTime',Date.now());
});

document.getElementById("exit").addEventListener("click", function() {
    window.location.replace('mainMenu.html');
});

document.addEventListener('DOMContentLoaded', function () {
    let userLoggedIn = checkLogin();
    if (userLoggedIn == true) {
        if (!window.location.href.includes(sessionStorage.getItem("currentRoom"))) {
            window.location.replace(sessionStorage.getItem("currentRoom"));
        }
    }
})

async function addRoomVisit() {
    let insertQuery = `UPDATE tblGameRoom SET timesVisited = timesVisited + 1 WHERE gameID = ${gameID} AND roomID = ${nextRoomID}`;
    dbConfig.set('query', insertQuery);

    try {
        let response = await fetch(dbConnectorUrl, {
            method: "POST",
            body: dbConfig
        });

        let result = await response.json();

        if (result.success) {
            console.log("Room visit count updated successfully");
        } else {
            console.error("Error updating room visit count");
        }
    } catch (error) {
        console.error("Error while updating room visit count", error);
    }
}