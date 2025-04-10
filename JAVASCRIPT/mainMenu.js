const menu = document.querySelector('.menu');
const newSavePopUp = document.getElementById('saveNameWrapper')
const saveNameInput = document.getElementById('saveNameInput');
const achievementContainer = document.querySelector('.achievementContainer');
const achievementIcon = document.getElementById('achievementIcon');
const achievementName = document.getElementById('achName');
const achievementDesc = document.getElementById('achDesc');

let userAchievementIDs;
let userID = sessionStorage.getItem("userID");


//Dylan's work
function openModal() {
    document.getElementById("signOutModal").style.display = "flex";
}

function closeModal() {
    document.getElementById("signOutModal").style.display = "none";
}

function signOut() {
    sessionStorage.clear();
    window.location.href = "login.html";
}



document.addEventListener("DOMContentLoaded", async function () {
    let validUser = checkLogin();
    if (validUser == false) {
        return;
    }

    //Fintan's work - check if available save slot
    await getUserAchievements();
    userAchievementIDs = JSON.parse(sessionStorage.getItem("achievementIDs"));
    document.getElementById('usernameDisplay').textContent = sessionStorage.getItem("displayName");
    checkTotalActiveGames();
    
    if (userAchievementIDs.length == 6 && !userAchievementIDs.some(achievement => achievement.achievementID == 6)) {
        awardAchievement(6,userID,'Images/completionist.png');
    }

    // font size
    document.documentElement.style.fontSize = `${sessionStorage.getItem("fontSize")}px`;
    

});

document.getElementById('saveSelectBtn').addEventListener('click', function() {
    window.location.replace('saveSelect.html');
})

document.getElementById('continueBtn').addEventListener('click', async function() {
    //Callum's work
    //take user to last played game
    let query = `SELECT gameID FROM tblGameSave WHERE userID = ${userID} AND status = ${activeGame} ORDER BY lastPlayedDate DESC;`

    dbConfig.set('query',query);

    try {
        let response = await fetch(dbConnectorUrl,{
            method:"POST",
            body:dbConfig
        });

        let result = await response.json();

        if (result.success) {
            let gameID = result.data[0].gameID;
            loadGame(gameID);
        }
    } catch (error) {
        console.log('error retrieving ID of most recent game');
        console.log(error);
    }    
})

//Enable and disable menu options based on number of games
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
            if (activeGameCount < 5) {
                document.getElementById('playBtn').removeAttribute('disabled');
            }
            else if(activeGameCount){
                document.getElementById('playBtn').setAttribute('disabled',true);
            }

            if(activeGameCount > 0) {
                document.getElementById('continueBtn').removeAttribute('disabled');
                document.getElementById('saveSelectBtn').removeAttribute('disabled');
            }
            else {
                document.getElementById('continueBtn').setAttribute('disabled',true);
                document.getElementById('saveSelectBtn').setAttribute('disabled',true);
            }
        }
    } catch (error) {
        console.log('error with checking the number of active games this user has');
        console.log(error);
    }
}



//Display new game name pop up
    document.getElementById('playBtn').addEventListener('click', function(){
    menu.style.display = 'none';
    newSavePopUp.style.display = 'flex';
    saveNameInput.value = '';
})

//Create new game
document.getElementById('startNewGame').addEventListener('click', async function(){
   
    if(saveNameInput.value != "") {

        let gameName = saveNameInput.value;
        //add game to database
        let insertQuery = `INSERT INTO tblGameSave(userID,currentRoom,currentState, gameName) VALUES(${userID},"introduction.html",1, "${gameName}")`;
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
                //create session storage
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
                sessionStorage.setItem('atticLightingOn',gameSave.atticLightingOn);
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

    }
    else {
        saveNameInput.style.animation = 'noNameInput 1s ';
        setTimeout(function() {
            saveNameInput.style.animation = 'none';
        }, 1000)
    }
    
})

document.getElementById('backFromSaveName').addEventListener('click', function() {
    newSavePopUp.style.display = 'none';
    menu.style.display = 'flex';
})





//add user achievements to session storage
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

//add game rooms for game save to database
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


//award user an achievement
async function awardAchievement(achievementID, userID, achievementIconAddress) {
    //add user achievement to database
    let insertQuery = `INSERT INTO tblUserAchievements (achievementID, userID) 
        VALUES (${achievementID}, ${userID});`;

    let newAchievement = { "achievementID": achievementID };
    userAchievementIDs.push(newAchievement);
    sessionStorage.setItem("achievementIDs", JSON.stringify(userAchievementIDs));

    dbConfig.set('query', insertQuery);

    try {
        response = await fetch(dbConnectorUrl, {
            method: "POST",
            body: dbConfig
        });

        let insertResult = await response.json();
        if (insertResult.success) {



            //retrieve achievement data and display
            let selectQuery = `SELECT name, description FROM tblAchievement

        WHERE  achievementID = ${achievementID};`;


            dbConfig.set('query', selectQuery);
            try {
                response = await fetch(dbConnectorUrl, {
                    method: "POST",
                    body: dbConfig
                });

                let result = await response.json();

                if (result.success && result.data.length > 0) {
                    let achievement = result.data[0];
                    displayAchievement(achievementIconAddress, achievement.name, achievement.description);
                    console.log(`achievement ${achievementID} added`);
                }

            } catch (error) {
                console.log("Error retrieving achievement data");
                console.log(error);
            }
        }
        else {
            console.error("Error saving the achievement to the database")
        }

    } catch (error) {
        console.log("Error setting achievement");
        console.log(error);
    }

   

}

//display achievement pop up
function displayAchievement(iconSRC, achName, achDesc) {
    achievementIcon.src = iconSRC;
    achievementName.innerHTML = achName;
    achievementDesc.innerHTML = achDesc;

    achievementContainer.classList.add('achExpanded')
    setTimeout(hideAchievement, 6500)
}

function hideAchievement() {
    achievementContainer.classList.remove('achExpanded')
}




//removes transition properties to prevent transitions applying during resizing
window.addEventListener('resize', function () {
    //disable transitions
    achievementContainer.classList.add('noTransition');

    //enable transition
    setTimeout(() => {
        achievementContainer.classList.remove('noTransition');
    }, 1000);
});