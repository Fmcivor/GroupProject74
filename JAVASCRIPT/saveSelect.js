
document.addEventListener('DOMContentLoaded', displayGameSaves);

async function loadGame(gameID) {

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
            console.log("game save id retrieved:", gameSave.gameID);

            let inventoryQuery = `SELECT tblItem.itemID, tblItem.itemName, tblItem.itemHREF 
            FROM tblGameInventory JOIN tblItem on tblGameInventory.itemID = tblItem.itemID 
            WHERE tblGameInventory.gameID = ${gameID}`;
            dbConfig.set("query", inventoryQuery);

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
            }
            else {
                console.error("Error loading the inventory");
            }

            let clueListQuery = `SELECT tblClue.clueID, tblClue.clueText FROM tblGameNotebook 
            JOIN tblClue on tblGameNotebook.clueID = tblClue.clueID 
            WHERE tblGameNotebook.gameID = ${gameID}`;

            dbConfig.set("query", clueListQuery);

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
            }
            else {
                console.error("Error occurred while loading the clues");
            }



            window.location.href = gameSave.currentRoom;
        }
        else {
            console.error("Error loading the game save");
        }

    } catch (error) {
        console.error("Error loading the selected gameSave,inventory and clue");
    }

}


async function displayGameSaves() {

    let selectQuery = `SELECT * FROM tblGameSave WHERE userID = 1 ORDER BY startDate DESC LIMIT 3`;
    dbConfig.set('query', selectQuery);

    try {
        let response = await fetch(dbConnectorUrl, {
            method: "POST",
            body: dbConfig
        });

        let result = await response.json();

        if (result.success && result.data.length > 0) {
            let saveContainer = document.querySelector('.saveContainer');
            saveContainer.innerHTML = '<h1>Select Save</h1>';
            let latestGames = result.data;
            let slotCounter = 1;
            latestGames.forEach(gameSave => {
                let saveSlotBtn = document.createElement('button');
                saveSlotBtn.value = gameSave.gameID;
                saveSlotBtn.textContent = `saveSlot${slotCounter}`;
                slotCounter++;
                saveSlotBtn.addEventListener('click', function (event) {
                    loadGame(event.target.value);
                })
                let saveSlotDiv = document.createElement('div');
                saveSlotDiv.classList.add('saveSlot');
                saveSlotDiv.appendChild(saveSlotBtn);
                saveContainer.appendChild(saveSlotDiv);
            });
        }
        else {
            console.error("Error while displaying saved games");
        }
    } catch (error) {
        console.error("Error while displaying saved games", error);
    }

}
