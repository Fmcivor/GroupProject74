let userID = sessionStorage.getItem("userID");



function openModal() {
    document.getElementById("signOutModal").style.display = "flex";
}




document.addEventListener("DOMContentLoaded", function () {
    checkLogin();
    const btnSignOut = document.getElementById("btnSignOut");
    const cancelSignOut = document.getElementById("confirmNo"); // Fix variable reference

    if (btnSignOut && signOutConfirm && cancelSignOut) {
        btnSignOut.addEventListener("click", function () {
            signOutConfirm.style.display = "flex";
        });

        cancelSignOut.addEventListener("click", function () {
            signOutConfirm.style.display = "none";
        });
    } else {
        console.error("One or more elements are missing in the DOM.");
    }



    //Fintan's work - check if available save slot
    getUserAchievements();
    document.getElementById('usernameDisplay').textContent = sessionStorage.getItem("displayName");
    checkTotalActiveGames();
    getUserAchievements();

    // font size
    document.documentElement.style.fontSize = `${sessionStorage.getItem("fontSize")}px`;


});

async function checkTotalActiveGames() {


    try {
        let response = await fetch("http://localhost:5257/api/Users/" + userID + "/activeGameCount", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        });

        if (response.ok) {
            let result = await response.json();

            if (result < 3) {
                document.getElementById('playBtn').removeAttribute('disabled');
            }
            else if (result) {
                document.getElementById('playBtn').setAttribute('disabled', true);
            }
        }

    } catch (error) {
        console.log('error with checking the number of active games this user has');
        console.log(error);
    }
}



//Start new game
document.getElementById('playBtn').addEventListener('click', async function () {

   

    try {
        let response = await fetch("http://localhost:5257/api/Users/" + userID + "/createNewGame", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify()
        });

        if (response.ok) {
            let result = await response.json();

            let gameSave = result;
            sessionStorage.setItem('gameID', gameSave.gameId);
            sessionStorage.setItem('electricityOn', gameSave.electricityOn);
            sessionStorage.setItem('frontDoorUnlocked', gameSave.frontDoorUnlocked);
            sessionStorage.setItem('currentRoom', gameSave.currentRoom);
            sessionStorage.setItem('currentState', gameSave.currentState);
            sessionStorage.setItem('inventory', JSON.stringify([]));
            sessionStorage.setItem('clueList', JSON.stringify([]));
            sessionStorage.setItem('noGeneratorRepairAttempts', gameSave.noGeneratorRepairAttempts);
            sessionStorage.setItem('timesOnSofa', gameSave.timesOnSofa);
            sessionStorage.setItem('lightingOn', gameSave.lightingOn);
            console.log("game save id retrieved:", gameSave.gameID);
            window.location.href = 'OutsideHouse.html';
        }
        else{
            console.error('Error creating a new game session');
            return;
        }

    } catch (error) {
        console.error("error creating a new game:", error);
    }
})


function closeModal() {
    document.getElementById("signOutModal").style.display = "none";
}

function signOut() {
    sessionStorage.clear();
    window.location.href = "login.html";
}



async function getUserAchievements() {

    try {
        let response = await fetch("http://localhost:5257/api/Users/" + userID + "/achievementIds", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        });


        if (response.ok) {
            let result = await response.json();

            let achievementIDs = result;
            sessionStorage.setItem("achievementIDs", JSON.stringify(achievementIDs));
            return true;
        }
        else {
            console.error("Error occurred while fetching the user achievements");
            return false;
        }
    } catch (error) {
        console.error("Error occurred while fetching the user achievements", error);
        return false;
    }


}