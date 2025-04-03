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

async function checkTotalActiveGames(){

    let query = `SELECT COUNT(*) as activeGames FROM tblGameSave WHERE userID =${userID} AND status = ${activeGame}`;

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
            else if(activeGameCount){
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
   
    
    let insertQuery = `INSERT INTO tblGameSave(userID,currentRoom,currentState) VALUES(${userID},"introduction.html",1)`;
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
            sessionStorage.setItem('lightingOn',gameSave.lightingOn);
            sessionStorage.setItem('status',gameSave.status);
            sessionStorage.setItem('gameSessionStartTime',Date.now());
            console.log("game save id retrieved:",gameSave.gameID);

           let roomsInitialised =  await initialiseGameRooms();

            if (roomsInitialised) {
                window.location.href = 'introduction.html';
            }
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



async function getUserAchievements(){
    let query = `SELECT achievementID FROM tblUserAchievements WHERE userID = ${userID}`;
    dbConfig.set("query",query);

    try {
        let response = await fetch(dbConnectorUrl,{
            method:"POST",
            body:dbConfig
        });
    
        let result = await response.json();
    
        if (result.success) {
            let achievementIDs = result.data;
            sessionStorage.setItem("achievementIDs",JSON.stringify(achievementIDs));
            return true;
        }
        else{
            console.error("Error occurred while fetching the user achievements");
            return false;
        }
    } catch (error) {
        console.error("Error occurred while fetching the user achievements",error);
        return false;
    }

    
}


async function initialiseGameRooms(){

    let query = `INSERT INTO tblGameRoom(roomID,gameID) SELECT roomID, ${sessionStorage.getItem("gameID")} FROM tblRoom`;
    dbConfig.set("query",query);

    try {
        let response = await fetch(dbConnectorUrl,{
            method:"POST",
            body:dbConfig
        });
    
        let result = await response.json();
    
        if (result.success) {
            console.log("Game rooms initialized successfully");
            return true;
        }
        else{
            console.error("Error occurred while fetching the game rooms");
            return false;
        }
    } catch (error) {
        throw new error("Error occurred while fetching the game rooms",error);
        return false;
    }
}