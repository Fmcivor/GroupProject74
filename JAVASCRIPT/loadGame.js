//LEAD DEVELOPER - FINTAN MCIVOR

// each method loads its corresponding data in its name from the database into session storage

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
    let inventoryQuery = `SELECT tblItem.itemID, tblItem.itemName, tblItem.itemHREF, tblGameInventory.itemUsed
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
                    existingItem.itemUsed = item.itemUsed;
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
            sessionStorage.setItem('atticLightingOn',gameSave.atticLightingOn);

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