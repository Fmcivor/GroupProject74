
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


async function displayGameSaves() {
    let userID = sessionStorage.getItem("userID");
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
                    saveSlotBtn.addEventListener('click', function (event) {
                        loadGame(event.currentTarget.value);
                    });
                    saveSlotBtn.classList.add('saveSlotBtn');


                    let deleteSaveBtn = document.createElement('button');
                    deleteSaveBtn.innerHTML = `<i class="fa-solid fa-trash deleteSaveIcon"></i>`;
                    deleteSaveBtn.classList.add('deleteSaveBtn');
                    deleteSaveBtn.value = gameSave.gameID;
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
                let menuLinkWrapper = document.createElement('div')
                menuLinkWrapper.classList.add('menuLinkWrapper');
                menuLinkWrapper.innerHTML = '<a class="btnMainMenu" href="mainMenu.html">Main Menu</a>'
                document.querySelector('.saveContainer').appendChild(menuLinkWrapper);

            }
        }
        else {
            console.error("Error while displaying saved games");
        }
    } catch (error) {
        console.error("Error while displaying saved games", error);
    }

}

