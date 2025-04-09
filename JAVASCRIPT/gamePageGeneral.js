//Lead Developer = FINTAN MCIVOR
//The general layout for all game pages
// but the game logic such as the button functions and the minigames is coded by each of the lead devleoper for that page
// we all worked and discussed the best way in which to implement interaction
// tooll bar -Fintan McIvor


//CONSTANTS
const toolbar = document.querySelector('.toolBar');
const inventoryButton = document.getElementById('inventoryButton');
const noteBookButton = document.getElementById('noteBookButton');
const hideToolBarButton = document.getElementById('hideToolBarButton');
const noteBookContainer = document.getElementById('noteBook');
const inventoryContainer = document.getElementById('inventory');
const promptDivider = document.getElementById('promptDivider');
const achievementContainer = document.querySelector('.achievementContainer');
const achievementIcon = document.getElementById('achievementIcon');
const achievementName = document.getElementById('achName');
const achievementDesc = document.getElementById('achDesc');
const settingsButton = document.getElementById('settingsButton');
const settingsContainer = document.querySelector('.settingsContainer');
const gameInteractionContainer = document.querySelector('.gameInteractionContainer');
const rightColumn = document.querySelector(".rightColumn");
const exitAndSaveBtn = document.getElementById('exitAndSaveBtn');
const deleteAndExit = document.getElementById('deleteAndExit');
const selectVictorButton = document.getElementById('victorButton');
const selectMargaretButton = document.getElementById('margaretButton');
const selectJonathanButton = document.getElementById('jonathanButton');
const confirmSuspectBtn = document.getElementById('suspectConfirmationYesBtn');
const cancelSuspectBtn = document.getElementById('suspectConfirmationNoBtn');

// item ids
const keyID = 1;
const lockpickID = 2;
const batteriesID = 3;
const pillBottleID = 4;
const safeCodeID = 5;
const flashLightID = 6;
const knifeItemID = 7;
const ringID = 8;

//clue ids
const rubbishClueID = 1;
const burntLetterClueID = 2;
const ringClueID = 3;
const computerClueID = 4;
const knifeClueID = 5;
const emailClueID = 7;
const drawerClueID = 8;


//VARIABLES
let currentState;
let selectedToolBarItem = null;
let typingInterval;
let typingIndex = 0;
let settingsOpen = false;
let suspectAccused = null;


let gameID = sessionStorage.getItem("gameID");
let electricityOn = JSON.parse(sessionStorage.getItem("electricityOn"));
let userID = sessionStorage.getItem("userID");
let displayName = sessionStorage.getItem("displayName");
let inventory = JSON.parse(sessionStorage.getItem("inventory"));
let clueList = JSON.parse(sessionStorage.getItem("clueList"));
let userAchievementIDs = JSON.parse(sessionStorage.getItem("achievementIDs"));

//EVENT LISTENERS
inventoryButton.addEventListener('click', showInventory);
noteBookButton.addEventListener('click', showNoteBook);
hideToolBarButton.addEventListener('click', hideToolBar);
settingsButton.addEventListener('click', toggleSettings);
exitAndSaveBtn.addEventListener('click', async function () {
    sessionStorage.setItem("currentState", currentState.ID);
    await saveGame();
    window.location.href = "mainMenu.html";
});

deleteAndExit.addEventListener('click', async function () {
    await deleteSave(gameID);
    window.location.href = "mainMenu.html";

});

selectVictorButton.addEventListener('click', accuseVictor);
selectMargaretButton.addEventListener('click', accuseMargaret);
selectJonathanButton.addEventListener('click', accuseJonathan);
confirmSuspectBtn.addEventListener('click', submitEvidence);
cancelSuspectBtn.addEventListener('click', closeSubmitEvidencePopUp);

document.addEventListener('DOMContentLoaded', function () {
    let userLoggedIn = checkLogin();
    if (userLoggedIn == true) {
        // if (!window.location.href.includes(sessionStorage.getItem("currentRoom"))) {
        //     window.location.replace(sessionStorage.getItem("currentRoom"));
        // }
        // else {

        document.getElementById('slider').value = sessionStorage.getItem("fontSize");
        let easyReadOn = JSON.parse(sessionStorage.getItem("easyReadOn"));
        if (easyReadOn == true) {
            document.querySelector('.toolBar').style.fontFamily = 'Arial, Helvetica, sans-serif';
        }
        else {
            document.querySelector('.toolBar').style.fontFamily = '"Lugrasimo", cursive';
        }

        UpdateInventory();
        updateClueNotebook();
        // }
    }
})

async function goToNextRoom(nextRoom, startingState) {
    sessionStorage.setItem("currentRoom", nextRoom);
    sessionStorage.setItem("currentState", startingState);
    await saveGame();
    await updateRoomVisits();
    window.location.replace(nextRoom);
}



//Show pop out toolbar functions
function showInventory() {
    noteBookContainer.classList.remove('displayNoteBook');
    inventoryContainer.classList.add('displayInventory');
    if (selectedToolBarItem === null) {
        toolbar.classList.add('toolBarExpanded');
        hideToolBarButton.classList.add('visible');
    }
    selectedToolBarItem = 'inventory';
}

function showNoteBook() {
    noteBookContainer.classList.add('displayNoteBook');
    inventoryContainer.classList.remove('displayInventory');
    if (selectedToolBarItem === null) {
        toolbar.classList.add('toolBarExpanded');
        hideToolBarButton.classList.add('visible');
    }

    selectedToolBarItem = 'noteBook';
}

function hideToolBar() {
    noteBookButton.style.pointerEvents = 'none';
    inventoryButton.style.pointerEvents = 'none';
    selectedToolBarItem = null;
    hideToolBarButton.classList.remove('visible');
    toolbar.classList.remove('toolBarExpanded');


    setTimeout(() => {
        noteBookContainer.classList.remove('displayNoteBook');
        inventoryContainer.classList.remove('displayInventory');
        noteBookButton.style.pointerEvents = 'auto';
        inventoryButton.style.pointerEvents = 'auto';
    }, 1000);

}

function toggleSettings() {
    if (settingsOpen == false) {
        settingsOpen = true;
        gameInteractionContainer.style.display = 'none';
        settingsContainer.style.display = 'flex';
    }
    else {
        settingsOpen = false;
        settingsContainer.style.display = 'none';
        gameInteractionContainer.style.display = 'flex';
    }

}


//Achievement pop up

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
    toolbar.classList.add('noTransition');
    inventoryContainer.classList.add('noTransition');
    noteBookContainer.classList.add('noTransition');
    achievementContainer.classList.add('noTransition');


    //enable transition
    setTimeout(() => {
        toolbar.classList.remove('noTransition');
        inventoryContainer.classList.remove('noTransition');
        noteBookContainer.classList.remove('noTransition');
        achievementContainer.classList.remove('noTransition');
    }, 1000);
});


//Game interaction - front of house - side of house - shed 

function updateState() {
    const roomHeader = document.getElementById('roomHeader');
    const description = document.getElementById('descriptionParagraph');
    const responseParagraph = document.getElementById('responseParagraph').textContent = '';
    const buttonContainer = document.getElementById('buttonContainer');
    const stateImageHref = currentState.ImageHREF;
    const descText = currentState.description;
    buttonContainer.innerHTML = '';
    roomHeader.textContent = currentState.room;
    document.getElementById('mobileHeader').textContent = currentState.room;
    description.textContent = '';



    //typing effect
    const descLength = descText.length;
    let totalTime = (2.26 * (Math.log(descLength)).toFixed(2) - 8.48) * 1000;
    totalTime = Math.min(5500, totalTime);
    let intervalTime = totalTime / descLength;
    intervalTime.toFixed(1);
    typingIndex = 0;
    let totalTypingTime = currentState.description.length * 20;
    clearInterval(typingInterval);
    typingInterval = setInterval(() => {
        description.textContent += descText[typingIndex];
        typingIndex++;
        if (typingIndex == currentState.description.length) {
            clearInterval(typingInterval);
        }

    }, intervalTime);


    //background image
    document.querySelector('.rightColumn').style.backgroundImage = `url("${stateImageHref}")`;




    //dynamic buttons

    currentState.interactions.forEach(interaction => {

        let button = document.createElement('button');
        button.classList.add('optionButton');
        button.id = interaction.id;
        button.innerHTML = `<i id="${interaction.id}" class="fa-solid fa-caret-right"></i>&nbsp ${interaction.Text}`;
        button.addEventListener('click', userDecisionHandler);
        // button.setAttribute('disabled', true);
        buttonContainer.appendChild(button);

    });
}


function userDecisionHandler(event) {
    responseId = event.target.id;
    let button = document.getElementById(responseId);
    button.style.color = 'rgb(153, 153, 153)';
    button.querySelector('i').style.color = 'rgb(153, 153, 153)';

    if (typeof currentState.interactions[responseId].response === 'string') {
        setResponse(currentState.interactions[responseId].response);
        document.getElementById('descriptionParagraph').textContent = currentState.description;

    }
    else {
        currentState.interactions[responseId].response(responseId);
    }
}


function setResponse(responseText) {
    clearInterval(typingInterval);

    const responseBox = document.getElementById('responseParagraph');
    document.getElementById('descriptionParagraph').textContent = currentState.description;
    responseBox.textContent = "";
    const responseLength = responseText.length;
    let totalTime = (2.26 * (Math.log(responseLength)).toFixed(2) - 8.48) * 1000;
    totalTime = Math.min(6000, totalTime)
    let intervalTime = totalTime / responseLength;
    intervalTime = Math.max(20, intervalTime)

    typingIndex = 0;
    typingInterval = setInterval(() => {
        responseBox.textContent += responseText[typingIndex];
        typingIndex++;
        if (typingIndex == responseLength) {
            clearInterval(typingInterval);
        }

    }, intervalTime);
}


function setDescriptionAndResponse(responseText) {
    const description = document.getElementById('descriptionParagraph');
    const descText = currentState.description;
    description.textContent = "";

    //typing effect
    const descLength = descText.length;
    let totalTime = (2.26 * (Math.log(descLength)).toFixed(2) - 8.48) * 1000;
    totalTime = Math.min(5500, totalTime);
    let intervalTime = totalTime / descLength;
    intervalTime.toFixed(1);
    typingIndex = 0;
    // let totalTypingTime = currentState.description.length * 20;
    clearInterval(typingInterval);
    typingInterval = setInterval(() => {
        description.textContent += descText[typingIndex];
        typingIndex++;
        if (typingIndex == currentState.description.length) {
            clearInterval(typingInterval);
            setResponseAfterDescription(responseText);
        }

    }, intervalTime);
}

function setResponseAfterDescription(responseText) {
    const responseBox = document.getElementById('responseParagraph');
    responseBox.textContent = "";
    const responseLength = responseText.length;
    let totalTime = (2.26 * (Math.log(responseLength)).toFixed(2) - 8.48) * 1000;
    totalTime = Math.min(6000, totalTime)
    let intervalTime = totalTime / responseLength;
    intervalTime = Math.max(20, intervalTime)

    typingIndex = 0;
    typingInterval = setInterval(() => {
        responseBox.textContent += responseText[typingIndex];
        typingIndex++;
        if (typingIndex == responseLength) {
            clearInterval(typingInterval);
        }

    }, intervalTime);
}


// ADD ITEMS, CLUES AND ACHIEVEMENTS


function UpdateInventory() {
    for (let i = 1; i < 7; i++) {
        document.getElementById(`slot${i}`).innerHTML = '';

    }
    let slotCount = 1;
    for (let i = 0; i < inventory.length; i++) {


        if (inventory[i] != null && inventory[i].itemUsed == false) {
            const slot = document.getElementById(`slot${slotCount}`);
            let itemBtn = document.createElement('button');
            itemBtn.classList.add('itemBtn');
            itemBtn.value = inventory[i].itemID;
            itemBtn.id = `item${slotCount}`;
            itemBtn.addEventListener('click', selectInventoryItem);

            let itemImage = document.createElement('img');
            itemImage.src = inventory[i].itemHREF;
            itemImage.classList.add('itemImg');
            itemImage.alt = inventory[i].itemName;
            itemImage.title = inventory[i].itemName;
            itemBtn.appendChild(itemImage);
            slot.appendChild(itemBtn);
            slotCount++;
        }
    }

}

function selectInventoryItem(event) {
    const selectedItemBtn = event.currentTarget;
    let inventoryUnusedCount = inventory.filter(item => item.itemUsed == false).length;

    for (let i = 0; i < inventoryUnusedCount; i++) {
        document.getElementById(`item${i + 1}`).style.border = '8px solid transparent';
    }

    selectedItemID = selectedItemBtn.value;
    selectedItemBtn.style.border = '8px solid #f5c518';


}


async function awardAchievement(achievementID, userID, achievementIconAddress) {
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




async function addClue(clueID) {

    if (clueList.length == 0 && userAchievementIDs.some(achievement => achievement.achievementID == 5) == false) {
        awardAchievement(5, userID, "Images/readableLetter.png");
    }

    let selectQuery = `SELECT * FROM tblClue WHERE clueID = ${clueID}`;

    dbConfig.set('query', selectQuery);

    try {
        let response = await fetch(dbConnectorUrl, {
            method: "POST",
            body: dbConfig
        });

        let result = await response.json();

        if (result.success && result.data.length > 0) {
            let clue = result.data[0];
            let clueToAdd = new Clue(clue.clueID, clue.clueText);
            clueList.push(clueToAdd);
            sessionStorage.setItem('clueList', JSON.stringify(clueList));
            updateClueNotebook();

            noteBookButton.querySelector('i').style.animation = 'toolBarIconNotification 2s';



            let insertQuery = `INSERT INTO tblGameNotebook (gameID,clueID) VALUES(${gameID},${clueToAdd.clueID})`;

            dbConfig.set('query', insertQuery);

            let insertResponse = await fetch(dbConnectorUrl, {
                method: "POST",
                body: dbConfig
            });

            let insertResult = await insertResponse.json();
            if (insertResult.success) {
                console.log("Clue successfully added and saved");
            }
            else {
                console.error("An error has occurred while recording the clue in the database");
            }
        }
        else {
            console.error("An error has occurred while retrieving the clue form the database");
        }
    } catch (error) {
        console.error("An error has occurred while adding the clues to the notebook", error);
    }



}

function updateClueNotebook() {
    document.getElementById('clueList').innerHTML = '';
    for (let i = 0; i < clueList.length; i++) {
        let clueElement = document.createElement("li");
        clueElement.textContent = clueList[i].clueText;
        document.getElementById('clueList').appendChild(clueElement);
    }
}


async function addItem(itemID) {


    let query = `SELECT * FROM tblItem WHERE itemID = '${itemID}'`;

    dbConfig.set('query', query);

    try {
        response = await fetch(dbConnectorUrl, {
            method: "POST",
            body: dbConfig
        });

        let result = await response.json();

        if (result.success && result.data.length > 0) {
            let newItem = new Item();
            Object.assign(newItem, result.data[0]);
            newItem.itemUsed = false;
            inventory.push(newItem);
            sessionStorage.setItem("inventory", JSON.stringify(inventory));
            UpdateInventory();

            let saveItemQuery = `INSERT INTO tblGameInventory (GameID,itemID)
                                VALUES(${sessionStorage.getItem("gameID")},${itemID})`;
            dbConfig.set("query", saveItemQuery);

            let saveItemResponse = await fetch(dbConnectorUrl, {
                method: "POST",
                body: dbConfig
            });

            let saveItemResult = await saveItemResponse.json();

            if (saveItemResult.success) {
                console.log("Inventory Updated Successfully");
            }
            else {
                console.error("Error saving the item to the inventory");
            }
        }
        else {
            console.error("Error saving the item to the inventory");
        }
    } catch (error) {
        console.log("Error adding the item to your inventory");
        console.log(error);
    }


    inventoryButton.querySelector('i').style.animation = 'toolBarIconNotification 2s';




}



//UPDATE GAMESAVE IN DATABASE
async function saveGame() {
    sessionStorage.setItem('gameSessionEndTime', Date.now());
    let totalTime = calculateGameSessionTime();
    let electricityOn = JSON.parse(sessionStorage.getItem("electricityOn"));
    let frontDoorUnlocked = JSON.parse(sessionStorage.getItem("frontDoorUnlocked"));
    let gameID = sessionStorage.getItem("gameID");
    let currentRoom = sessionStorage.getItem("currentRoom");
    let currentStateID = currentState.ID;

    let atticLightingOn = JSON.parse(sessionStorage.getItem('atticLightingOn'));

    let status = sessionStorage.getItem("status");

    let lightingOn = JSON.parse(sessionStorage.getItem("lightingOn"));
    let noGeneratorRepairAttempts = sessionStorage.getItem("noGeneratorRepairAttempts");
    let timesOnSofa = sessionStorage.getItem("timesOnSofa");


    let updateQuery = `UPDATE tblGameSave SET
                        electricityOn = ${electricityOn},
                        frontDoorUnlocked = ${frontDoorUnlocked},
                        currentRoom = '${currentRoom}',
                        atticLightingOn = ${atticLightingOn},

                        currentState = ${currentStateID},
                        lightingOn = ${lightingOn},
                        noGeneratorRepairAttempts = ${noGeneratorRepairAttempts},
                        timesOnSofa = ${timesOnSofa},
                        timePlayed = SEC_TO_TIME(TIME_TO_SEC(timePlayed)+TIME_TO_SEC('${totalTime}')),
                        status = ${status}

                        WHERE gameID = ${gameID}`;

    dbConfig.set("query", updateQuery);

    try {
        let updateResponse = await fetch(dbConnectorUrl, {
            method: "POST",
            body: dbConfig
        });

        let updateResult = await updateResponse.json();

        if (updateResult.success) {
            console.log("game successfully saved");
        }
        else {
            console.error("error saving the game")
        }
    } catch (error) {
        onsole.error("error saving the game")
    }

    sessionStorage.setItem("gameSessionStartTime", Date.now());
    sessionStorage.setItem("gameSessionEndTime", null);

}


async function updateRoomVisits() {
    let currentRoom = sessionStorage.getItem("currentRoom");
    let visitedRoomID = '';

    switch (currentRoom) {
        case 'OutsideHouse.html':
            visitedRoomID = 1;
            break;
        case 'downStairsHall.html':
            visitedRoomID = 2;
            break;
        case 'livingRoom.html':
            visitedRoomID = 3;
            break;
        case 'study.html':
            visitedRoomID = 4;
            break;
        case 'kitchen.html':
            visitedRoomID = 5;
            break;
        case 'upstairsHall.html':
            visitedRoomID = 6;
            break;
        case 'masterBedroom.html':
            visitedRoomID = 7;
            break;
        case 'guestBedroom.html':
            visitedRoomID = 8;
            break;
        case 'attic.html':
            visitedRoomID = 9;
            break;
        default:
            console.log('Unknown room: ' + currentRoom);
            visitedRoomID = null;
            break;
    }


    if (visitedRoomID == null) {
        console.log('no room found');
        return;
    }


    let insertQuery = `UPDATE tblGameRoom SET timesVisited = timesVisited + 1 WHERE gameID = ${gameID} AND roomID = ${visitedRoomID}`;
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



function calculateGameSessionTime() {
    let start = Number(sessionStorage.getItem('gameSessionStartTime'));
    let end = Number(sessionStorage.getItem('gameSessionEndTime'));

    let milliseconds = end - start;

    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const paddedHours = hours.toString().padStart(2, '0');
    const paddedMinutes = minutes.toString().padStart(2, '0');
    const paddedSeconds = seconds.toString().padStart(2, '0');

    const totalTime = `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
    return totalTime;
}


//preferences and settings

const fontSlider = document.getElementById('slider');
const savePreferencesBtn = document.getElementById('savePreferencesBtn');

fontSlider.oninput = function () {
    document.getElementById('sampleText').style.fontSize = `${fontSlider.value}px`;
}

savePreferencesBtn.addEventListener('click', savePreferences);

async function savePreferences() {
    let easyReadOn = easyReadCheckBox.checked;
    sessionStorage.setItem("fontSize", fontSlider.value);
    sessionStorage.setItem("easyReadOn", easyReadOn);
    if (easyReadOn == true) {
        document.documentElement.style.fontFamily = 'Arial, Helvetica, sans-serif';
        document.querySelector('.toolBar').style.fontFamily = 'Arial, Helvetica, sans-serif';
    }
    else {
        document.documentElement.style.fontFamily = '"merriweather", serif';
        document.querySelector('.toolBar').style.fontFamily = '"Lugrasimo", cursive';
    }
    document.documentElement.style.fontSize = `${fontSlider.value}px`;

    let saveQuery = `UPDATE tblUser SET fontSize = ${fontSlider.value},easyReadOn = ${easyReadOn}`;
    dbConfig.set('query', saveQuery);

    try {
        let response = await fetch(dbConnectorUrl, {
            method: "POST",
            body: dbConfig
        });

        let result = await response.json();

        if (result.success) {
            console.log("Font size and easy read updated and saved");
        }
        else {
            console.error("Error occurred while saving the font size and easy read");
        }

    } catch (error) {
        console.error("Error while saving the font size and easy read", error);
    }

}



// USE ITEMS AND SUBMIT EVIDENCE

document.getElementById('useItemBtn').addEventListener('click', async function () {

    if (selectedItemID == null) {
        setResponse("You must select an item before you can use it");
        return;
    }

    let currentRoom = sessionStorage.getItem("currentRoom");
    let validItemUse = false;

    switch (currentRoom) {
        case "downStairsHall.html":
            break;
        case "guestBedroom.html":
            break;
        case "kitchen.html":
            break;
        case "livingRoom.html":
            break;
        case "masterBedroom.html":
            break;
        case "OutsideHouse.html":
            if (currentState == frontOfHouseDoorLocked || currentState == frontOfHouseDoorUnlocked) {
                if (doorUnlocked == false && selectedItemID == keyID) {
                    setResponse('You have unlocked the door.');
                    doorUnlocked = true;
                    sessionStorage.setItem('frontDoorUnlocked', JSON.stringify(doorUnlocked));
                    validItemUse = true;
                }
                else if (doorUnlocked == true && selectedItemID == keyID) {
                    setResponse('You have locked the door again.');
                    validItemUse = true;
                    doorUnlocked = false;
                    sessionStorage.setItem('frontDoorUnlocked', JSON.stringify(doorUnlocked));
                }
            }
            break;
        case "study.html":
            if (currentState == studyDefault && selectedItemID == lockpickID) {
                document.getElementById('LockPickGameContainer').style.display = "flex";
                setResponse("Click when the moving box is on the red line to unlock the drawer.");
                validItemUse = true;
            }
            break;
        case "upstairsHall.html":
            break;
        case "attic.html":
            if (currentState == darkAttic && selectedItemID == flashLightID) {
                if (!flashLightActive && inventory.some(item => item.itemID == batteriesID && item.itemUsed == true)) {
                    flashLightActive = true;
                    validItemUse = true;
                    toggleFlashLight();
                } else if (flashLightActive) {
                    setResponse('You no longer require the flashlight');
                    flashLightActive = false;
                    toggleFlashLight();
                    validItemUse = true;
                }
                else {
                    setResponse("You maybe need some batteries first.");
                    validItemUse = true;
                }
            }
            break;
        default:
            console.error("Room not found!");
    }

    if (selectedItemID == ringID) {
        validItemUse = true;
        setResponse("You have tried on the ring... for investigative purposes of course!");
        const ringIndex = inventory.findIndex(item => item.itemID == ringID);
        inventory[ringIndex].itemUsed = true;
        sessionStorage.setItem("inventory", JSON.stringify(inventory));
        UpdateInventory();
        let updateQuery = `UPDATE tblGameInventory SET itemUsed = 1 WHERE gameID = ${gameID} AND itemID = ${ringID}`;
        dbConfig.set('query', updateQuery);

        try {
            let response = await fetch(dbConnectorUrl, {
                method: "POST",
                body: dbConfig
            });

            let result = await response.json();

            if (result.success) {
                console.log("Item usage updated successfully in the database");
            }
            else {
                console.error("Error updating item usage in the database");
            }
        } catch (error) {
            console.error("Error updating item usage in the database", error);
        }

        if (userAchievementIDs.some(achievement => achievement.achievementID == 3) == false) {
            awardAchievement(3, userID, "Images/ring.png");
        }
    }

    if (selectedItemID == batteriesID && inventory.some(item => item.itemID == flashLightID)) {
        setResponse("You put the batteries into the flashlight, maybe this will help somewhere.");
        const batteryIndex = inventory.findIndex(item => item.itemID == batteriesID);
        inventory[batteryIndex].itemUsed = true;
        sessionStorage.setItem("inventory", JSON.stringify(inventory));
        UpdateInventory();
        let updateQuery = `UPDATE tblGameInventory SET itemUsed = 1 WHERE gameID = ${gameID} AND itemID = ${batteriesID}`;
        dbConfig.set('query', updateQuery);

        validItemUse = true;

        try {
            let response = await fetch(dbConnectorUrl, {
                method: "POST",
                body: dbConfig
            });

            let result = await response.json();

            if (result.success) {
                console.log("Item usage updated successfully in the database");
            }
            else {
                console.error("Error updating item usage in the database");
            }
        } catch (error) {
            console.error("Error updating item usage in the database", error);
        }
    }
    else if (selectedItemID == batteriesID) {
        setResponse("You maybe need somewhere to put them first");
    }


    if (validItemUse == false) {
        setResponse("That didn't seem to work, maybe I should try something else?");
    }

});



document.getElementById('submitEvidenceBtn').addEventListener('click', async function () {
    document.getElementById("evidencePopUp").style.display = "flex";

});

async function submitEvidence() {
    let knifeClue = clueList.some(clue => clue.clueID == knifeClueID);
    let victorGuiltyClue = clueList.some(clue => clue.clueID == burntLetterClueID);
    let jonathanInnocentClue = clueList.some(clue => clue.clueID == emailClueID);
    let margaretInnocentClue = clueList.some(clue => clue.clueID == rubbishClueID);

    sessionStorage.setItem("invetory", JSON.stringify(inventory));

    if (suspectAccused != null) {
        if (suspectAccused == 'victor' && knifeClue && victorGuiltyClue && margaretInnocentClue && jonathanInnocentClue) {
            sessionStorage.setItem("status", gameWin);
            sessionStorage.setItem("currentRoom", "endGameWin.html");
            await saveGame();
            window.location.replace("endGameWin.html");
        }
        else {
            sessionStorage.setItem("murderWeaponFound", knifeClue);
            sessionStorage.setItem("suspectAccused", suspectAccused);
            sessionStorage.setItem("victorGuiltyClue", victorGuiltyClue);
            sessionStorage.setItem("jonathanInnocentClue", jonathanInnocentClue);
            sessionStorage.setItem("margaretInnocentClue", margaretInnocentClue);


            sessionStorage.setItem("status", gameLoss);
            sessionStorage.setItem("currentRoom", "endGameLoss.html");
            await saveGame();
            window.location.replace("endGameLoss.html");



        }
    }
    else {
        selectVictorButton.style.animation = 'noSuspectSelected 1s';
        selectJonathanButton.style.animation = 'noSuspectSelected 1s';
        selectMargaretButton.style.animation = 'noSuspectSelected 1s';
        confirmSuspectBtn.style.animation = 'noSuspectSelected 1s';
        setTimeout(function () {
            selectVictorButton.style.animation = 'none';
            selectJonathanButton.style.animation = 'none';
            selectMargaretButton.style.animation = 'none';
            confirmSuspectBtn.style.animation = 'none';
        }, 1000);
    }
}

function closeSubmitEvidencePopUp() {
    document.getElementById("evidencePopUp").style.display = "none";
    suspectAccused = null;
}

function accuseVictor() {
    selectVictorButton.style.border = '#ffee35 solid 3px'
    selectMargaretButton.style.border = 'rgb(10, 10, 40) 3px solid';
    selectJonathanButton.style.border = 'rgb(10, 10, 40) 3px solid';
    suspectAccused = 'victor';
}
function accuseMargaret() {
    selectMargaretButton.style.border = '#ffee35 solid 3px'
    selectVictorButton.style.border = 'rgb(10, 10, 40) 3px solid';
    selectJonathanButton.style.border = 'rgb(10, 10, 40) 3px solid';
    suspectAccused = 'margaret';
}
function accuseJonathan() {
    selectJonathanButton.style.border = '#ffee35 solid 3px'
    selectVictorButton.style.border = 'rgb(10, 10, 40) 3px solid';
    selectMargaretButton.style.border = 'rgb(10, 10, 40) 3px solid';
    suspectAccused = 'jonathan';
}
