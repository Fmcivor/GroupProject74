
document.addEventListener('DOMContentLoaded', async function () {
    checkLogin();
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


async function loadGame(gameID) {

    let inventoryLoaded = await loadInventory(gameID);
    let clueListLoaded = await loadClueList(gameID);
    let gameSaveDataLoaded = await loadGameSaveData(gameID);

    if (inventoryLoaded && clueListLoaded && gameSaveDataLoaded) {

        sessionStorage.setItem('gameSessionStartTime',Date.now());

        let updateQuery = `UPDATE tblGameSave SET lastPlayedDate = CURRENT_TIMESTAMP WHERE gameID =${gameID}`;

        dbConfig.set('query', updateQuery);


        try {
            let response = await fetch(dbConnectorUrl, {
                method: "POST",
                body: dbConfig
            });

            let result = await response.json();

            if (result.success) {
                console.log("Last played time stamp updated successfully");
            }
            else {
                console.error("Error occurrred while updating the last played time stamp");

            }
        } catch (error) {
            console.error("Error occurrred while updating the last played time stamp", error);
        }

        window.location.href = sessionStorage.getItem("currentRoom");
    }



}

async function loadInventory(gameID) {
    let inventoryQuery = `SELECT tblItem.itemID, tblItem.itemName, tblItem.itemHREF 
            FROM tblGameInventory JOIN tblItem on tblGameInventory.itemID = tblItem.itemID 
            WHERE tblGameInventory.gameID = ${gameID}`;
    dbConfig.set("query", inventoryQuery);

    try {
        let inventoryResponse = await fetch(dbConnectorUrl, {
            method: "POST",
            body: dbConfig
        });

        let inventoryResult = await inventoryResponse.json();

        if (inventoryResult.success) {
            let inventoryArray = inventoryResult.data;
            let inventory = [];
            if (inventoryArray.length > 0) {
                inventoryArray.forEach(item => {
                    let existingItem = new Item(item.itemID, item.itemName, item.itemHREF);
                    inventory.push(existingItem);
                });
            }
            sessionStorage.setItem("inventory", JSON.stringify(inventory));
            return true;
        }
        else {
            console.error("Error loading the inventory");
            return false;
        }
    } catch (error) {
        console.error("Error loading the inventory");
        return false;
    }

}

async function loadClueList(gameID) {
    let clueListQuery = `SELECT tblClue.clueID, tblClue.clueText FROM tblGameNotebook 
            JOIN tblClue on tblGameNotebook.clueID = tblClue.clueID 
            WHERE tblGameNotebook.gameID = ${gameID}`;

    dbConfig.set("query", clueListQuery);

    try {


        let clueListResponse = await fetch(dbConnectorUrl, {
            method: "POST",
            body: dbConfig
        });

        let clueListResult = await clueListResponse.json();

        if (clueListResult.success) {
            let clueList = [];
            if (clueListResult.data.length > 0) {
                let clueListArray = clueListResult.data;


                clueListArray.forEach(clue => {
                    let exisitingClue = new Clue(clue.clueID, clue.clueText);
                    clueList.push(exisitingClue);
                });

            }
            sessionStorage.setItem("clueList", JSON.stringify(clueList));
            return true;
        }
        else {
            console.error("Error occurred while loading the clues");
            return false;
        }
    } catch (error) {
        console.error("Error occurred while loading the clues");
        return false;
    }
}



async function loadGameSaveData(gameID) {
    let selectQuery = `SELECT * FROM tblGameSave WHERE gameID = ${gameID}`;
    dbConfig.set('query', selectQuery);

    try {
        let response = await fetch(dbConnectorUrl, {
            method: "POST",
            body: dbConfig
        });

        let result = await response.json();

        if (result.success && result.data.length > 0) {
            let gameSave = result.data[0];
            sessionStorage.setItem('gameID', gameSave.gameID);
            sessionStorage.setItem('electricityOn', gameSave.electricityOn);
            sessionStorage.setItem('frontDoorUnlocked', gameSave.frontDoorUnlocked);
            sessionStorage.setItem('currentRoom', gameSave.currentRoom);
            sessionStorage.setItem('currentState', gameSave.currentState);
            sessionStorage.setItem('noGeneratorRepairAttempts', gameSave.noGeneratorRepairAttempts);
            sessionStorage.setItem('timesOnSofa', gameSave.timesOnSofa);
            sessionStorage.setItem('lightingOn', gameSave.lightingOn);
            sessionStorage.setItem('status',gameSave.status);

            console.log("game save id retrieved:", gameSave.gameID);


            return true;
        }
        else {
            console.error("Error loading the game save");
            return false;
        }

    } catch (error) {
        console.error("Error loading the selected gameSave,inventory and clue", error);
        return false;
    }
}


async function displayGameSaves() {
    let userID = sessionStorage.getItem("userID");
    let selectQuery = `SELECT gameID,startDate, lastPlayedDate FROM tblGameSave WHERE userID = ${userID} AND status = ${activeGame} ORDER BY lastPlayedDate DESC LIMIT 3`;

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
            let slotCounter = 1;

            if (latestGames.length < 1) {
                saveWrapper.innerHTML = '<h3>No active games</h2>';
            }
            else {


                latestGames.forEach(gameSave => {
                    let saveSlotBtn = document.createElement('button');
                    saveSlotBtn.value = gameSave.gameID;
                    

                    const startDate = new Date(gameSave.startDate);
                    const day = String(startDate.getUTCDate()).padStart(2, '0'); 
                    const month = String(startDate.getUTCMonth() + 1).padStart(2, '0');
                    const year = startDate.getUTCFullYear();

                    const formattedDate = `${day}/${month}/${year}`;
                    saveSlotBtn.innerHTML = `<p id='saveName' style='font-size:1.2rem'>save${slotCounter}</p> <p id='startDate' style='font-size:1rem'>Start Date: ${formattedDate}</p>`;
                    slotCounter++;
                    saveSlotBtn.addEventListener('click', function (event) {
                        loadGame(event.currentTarget.value);
                    });
                    saveSlotBtn.classList.add('saveSlotBtn');


                    let deleteSaveBtn = document.createElement('button');
                    deleteSaveBtn.innerHTML = `<i class="fa-solid fa-trash deleteSaveIcon"></i>`;
                    deleteSaveBtn.classList.add('deleteSaveBtn');
                    deleteSaveBtn.value = gameSave.gameID;
                    deleteSaveBtn.addEventListener('click', async function (event) {
                        document.getElementById('confirmationMessage').textContent = 'Are you sure you ewant to delete this save slot';
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

}

