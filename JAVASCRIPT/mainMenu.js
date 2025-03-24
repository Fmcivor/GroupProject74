let userID = sessionStorage.getItem("userID");



function openModal() {
    document.getElementById("signOutModal").style.display = "flex";
}




document.addEventListener("DOMContentLoaded", function () {
    const btnSignOut = document.getElementById("btnSignOut");
    const signOutConfirm = document.getElementById("signOutConfirm");
    const cancelSignOut = document.getElementById("confirmNo"); // Fix variable reference

    if (btnSignOut && signOutConfirm && cancelSignOut) {
        btnSignOut.addEventListener("click", function () {
            signOutConfirm.style.display = "flex"; // Show the confirmation (not block)
        });

        cancelSignOut.addEventListener("click", function () {
            signOutConfirm.style.display = "none"; // Hide when cancel is clicked
        });
    } else {
        console.error("One or more elements are missing in the DOM.");
    }


    //Fintan's work - check if available save slot

    document.getElementById('usernameDisplay').textContent = sessionStorage.getItem("username");
    checkTotalActiveGames();
    
});

async function checkTotalActiveGames(){

    let query = `SELECT COUNT(*) as activeGames FROM tblGameSave WHERE userID =${userID} AND complete = 0`;

    dbConfig.set('query',query);

    try {
        let response = await fetch(dbConnectorUrl,{
            method:"POST",
            body:dbConfig
        });

        let result = await response.json();

        if (result.success) {
            let activeGameCount = result.data[0].activeGames;
            if (activeGameCount <3) {
                document.getElementById('playBtn').removeAttribute('disabled');
            }
            else{
                document.getElementById('playBtn').setAttribute('disabled',true);
            }
        }
    } catch (error) {
        console.log('error with checking the number of active games this user has');
        console.log(error);
    }
}



//Start new game
document.getElementById('playBtn').addEventListener('click',async function(){

    let insertQuery = `INSERT INTO tblGameSave(userID,currentRoom,currentState) VALUES(${userID},"guestBedroom.html",1)`;
    dbConfig.set('query',insertQuery);

    try {
        let response = await fetch(dbConnectorUrl,{
            method:"POST",
            body:dbConfig
        });

        let result = await response.json();

        if (!result.success) {
            console.error('Error creating a new game session');
            return;
        }

        let selectQuery = `SELECT * FROM tblGameSave WHERE userID =${userID} ORDER BY startDate DESC LIMIT 1`;
        dbConfig.set('query',selectQuery);

        let selectResponse = await fetch(dbConnectorUrl,{
            method:"POST",
            body:dbConfig
        });

        let selectResult = await selectResponse.json();

        if (selectResult.success && selectResult.data.length>0) {
            let gameSave = selectResult.data[0];
            sessionStorage.setItem('gameID',gameSave.gameID);
            sessionStorage.setItem('electricityOn',gameSave.electricityOn);
            sessionStorage.setItem('frontDoorUnlocked',gameSave.frontDoorUnlocked);
            sessionStorage.setItem('currentRoom',gameSave.currentRoom);
            sessionStorage.setItem('currentState',gameSave.currentState);
            sessionStorage.setItem('inventory',JSON.stringify([]));
            sessionStorage.setItem('clueList',JSON.stringify([]));
            sessionStorage.setItem('noGeneratorRepairAttempts',gameSave.noGeneratorRepairAttempts);
            sessionStorage.setItem('timesOnSofa',gameSave.timesOnSofa);
            console.log("game save id retrieved:",gameSave.gameID);
            window.location.href = 'guestBedroom.html';
        }
        else{
            console.error("failed to retrieve latest game save ID:",selectResult)
        }

    } catch (error) {
        console.error("error creating a new game:",error);
    }
})


function closeModal() {
    document.getElementById("signOutModal").style.display = "none";
}

function signOut() {
    sessionStorage.clear();
    window.location.href = "login.html";
}