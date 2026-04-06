//lead devloper - FINTAN MCIVOR
let menuLinkWrapper = document.createElement('div')
        menuLinkWrapper.classList.add('menuLinkWrapper');
        menuLinkWrapper.innerHTML = '<a class="btnMainMenu" href="mainMenu.html">Main Menu</a>'
        document.querySelector('.saveContainer').appendChild(menuLinkWrapper);

document.addEventListener('DOMContentLoaded', async function () {
    let validUser = checkLogin();
    if (validUser == false) {
        return;        
    }
    document.getElementById('usernameDisplay').textContent = sessionStorage.getItem("displayName");
    await displayGameSaves();
});

document.getElementById('noBtn').addEventListener('click', function () {
    document.getElementById('deletePopUp').style.display = 'none';
    document.getElementById('yesBtn').value = null;
});

document.getElementById('yesBtn').addEventListener('click', async function (event) {
    let gameSaveID = event.target.value;
    await deleteSave(gameSaveID);
    await displayGameSaves();
    document.getElementById('yesBtn').value = null;
    document.getElementById('deletePopUp').style.display = 'none';
    
});

// retieves and displays the 5 most recent active game saves for the user
//Developed by Callum and Fintan
async function displayGameSaves() {
    let userID = sessionStorage.getItem("userID");

    /*
    // database version (commented out)
    let selectQuery = `SELECT gameID, timePlayed, DATE_FORMAT(lastPlayedDate, '%d/%m/%Y') AS 'dateLastPlayed', DATE_FORMAT(lastPlayedDate, '%H:%i') AS 'timeLastPlayed', gameName 
                        FROM tblGameSave WHERE userID = ${userID}  AND status = ${activeGame} ORDER BY lastPlayedDate DESC LIMIT 5;`;

    dbConfig.set('query', selectQuery);

    try {
        let response = await fetch(dbConnectorUrl, {
            method: "POST",
            body: dbConfig
        });

        let result = await response.json();


        if (result.success) {

            let saveWrapper = document.getElementById('saveSlotWrapper');
            saveWrapper.innerHTML = '';
            let latestGames = result.data;

            if (latestGames.length < 1) {
                saveWrapper.innerHTML = '<h2>No active games</h2>';
            }
            else {

                // displays each game save
                latestGames.forEach(gameSave => {
                    let saveSlotBtn = document.createElement('button');
                    saveSlotBtn.value = gameSave.gameID;
                    
                    let lastPlayedDate = gameSave.dateLastPlayed;
                    let lastPlayedTime = gameSave.timeLastPlayed;
                    let timePlayed = gameSave.timePlayed;
                    let gameName = gameSave.gameName

                    saveSlotBtn.innerHTML = `<h3 id='saveName'>
                                                ${gameName}
                                            </h3>
                                            <div class = 'statRowWrapper'>
                                                <p class = 'gameStat' style='font-size:1rem'>Last Played: ${lastPlayedTime} ${lastPlayedDate}</p>
                                                <p class = 'gameStat' style='font-size:1rem'>Playtime: ${timePlayed}</p>
                                            </div> `;

                    // loads the game save when clicked
                    saveSlotBtn.addEventListener('click', function (event) {
                        loadGame(event.currentTarget.value);
                    });
                    saveSlotBtn.classList.add('saveSlotBtn');


                    let deleteSaveBtn = document.createElement('button');
                    deleteSaveBtn.innerHTML = `<i class="fa-solid fa-trash deleteSaveIcon"></i>`;
                    deleteSaveBtn.classList.add('deleteSaveBtn');
                    deleteSaveBtn.value = gameSave.gameID;
                    // deletes the game save when clicked
                    deleteSaveBtn.addEventListener('click', async function (event) {
                        document.getElementById('confirmationMessage').textContent = 'Are you sure you want to delete this save slot';
                        document.getElementById('yesBtn').value = event.currentTarget.value;
                        document.getElementById('deletePopUp').style.display = 'flex';
                    });


                    let saveSlotDiv = document.createElement('div');
                    saveSlotDiv.classList.add('saveSlot');
                    saveSlotDiv.appendChild(saveSlotBtn);
                    saveSlotDiv.appendChild(deleteSaveBtn);
                    saveWrapper.appendChild(saveSlotDiv);
                });
            }

            
        }
        else {
            console.error("Error while displaying saved games");
        }
    } catch (error) {
        console.error("Error while displaying saved games", error);
    }
    */

    // localStorage version
    let gameSaves = lsGet('ls_gameSaves');
    let userGames = gameSaves.filter(g => String(g.userID) === String(userID) && Number(g.status) === activeGame);
    userGames.sort((a, b) => new Date(b.lastPlayedDate) - new Date(a.lastPlayedDate));
    let latestGames = userGames.slice(0, 5);

    let saveWrapper = document.getElementById('saveSlotWrapper');
    saveWrapper.innerHTML = '';

    if (latestGames.length < 1) {
        saveWrapper.innerHTML = '<h2>No active games</h2>';
    }
    else {
        latestGames.forEach(gameSave => {
            let saveSlotBtn = document.createElement('button');
            saveSlotBtn.value = gameSave.gameID;

            let dateObj = new Date(gameSave.lastPlayedDate);
            let lastPlayedDate = dateObj.toLocaleDateString('en-GB');
            let lastPlayedTime = dateObj.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
            let timePlayed = gameSave.timePlayed || '00:00:00';
            let gameName = gameSave.gameName;

            saveSlotBtn.innerHTML = `<h3 id='saveName'>
                                        ${gameName}
                                    </h3>
                                    <div class = 'statRowWrapper'>
                                        <p class = 'gameStat' style='font-size:1rem'>Last Played: ${lastPlayedTime} ${lastPlayedDate}</p>
                                        <p class = 'gameStat' style='font-size:1rem'>Playtime: ${timePlayed}</p>
                                    </div> `;

            // loads the game save when clicked
            saveSlotBtn.addEventListener('click', function (event) {
                loadGame(event.currentTarget.value);
            });
            saveSlotBtn.classList.add('saveSlotBtn');

            let deleteSaveBtn = document.createElement('button');
            deleteSaveBtn.innerHTML = `<i class="fa-solid fa-trash deleteSaveIcon"></i>`;
            deleteSaveBtn.classList.add('deleteSaveBtn');
            deleteSaveBtn.value = gameSave.gameID;
            // deletes the game save when clicked
            deleteSaveBtn.addEventListener('click', async function (event) {
                document.getElementById('confirmationMessage').textContent = 'Are you sure you want to delete this save slot';
                document.getElementById('yesBtn').value = event.currentTarget.value;
                document.getElementById('deletePopUp').style.display = 'flex';
            });

            let saveSlotDiv = document.createElement('div');
            saveSlotDiv.classList.add('saveSlot');
            saveSlotDiv.appendChild(saveSlotBtn);
            saveSlotDiv.appendChild(deleteSaveBtn);
            saveWrapper.appendChild(saveSlotDiv);
        });
    }

}

