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

// item ids
const keyID = 1;
const lockpickID = 2;

//clue ids
const rubbishClueID = 1;

//VARIABLES
let currentState;
let selectedToolBarItem = null;
let typingInterval;
let settingsOpen = false;


let gameID = sessionStorage.getItem("gameID");
let electricityOn = JSON.parse(sessionStorage.getItem("electricityOn"));
let userID = sessionStorage.getItem("userID");
let displayName = sessionStorage.getItem("displayName");
let inventory = JSON.parse(sessionStorage.getItem("inventory"));
let clueList = JSON.parse(sessionStorage.getItem("clueList"));
let userAchievementIDs = JSON.parse(sessionStorage.getItem("achievementIDs"));


//ACHIEVEMENTID CONSTANTS
const CRIME_DOESNT_REST_BUT_I_DO_ID = "6a0495d8147b125a84564fe1";
const ONE_HIT_WONDER_ID = "6a0495d8147b125a84564fe2";
const GLAMOUROUS_JOB_ID = "6a0495d8147b125a84564fe3";
const WINNING_WAYS_ID = "6a0495d8147b125a84564fe4";
const GETTING_THINGS_STARTED_ID = "6a0495d8147b125a84564fe5";
const COMPLETIONIST_ID = "6a0495d8147b125a84564fe6";
const BEHIND_CLOSED_DRAWERS_ID = "6a0495d8147b125a84564fe7";

//clue constants
const POSTCARD_FROM_MARGARET_CLUE_ID = "69fe61dc933941371baba799";
const VICTOR_LETTER_CLUE_ID = "69fe62cbb236ccb9df244332";
const WEDDING_RING_CLUE_ID = "69fe62d0b236ccb9df244333";
const LUNA_DIED_CLUE_ID = "69fe62ecb236ccb9df244334";
const BLOODY_KNIFE_CLUE_ID = "69fe62fbb236ccb9df244335";
const MISSING_GLASS_PIECE_CLUE_ID = "69fe6302b236ccb9df244336";


//item constants
const KEY_ID = "69fe6454b236ccb9df24433c";
const LOCKPICK_ID = "69fe6454b236ccb9df24433d";
const BATTERIES_ID = "69fe6454b236ccb9df24433e";
const PILL_BOTTLE_ID = "69fe6454b236ccb9df24433f";
const SECRET_CODE_ID = "69fe6454b236ccb9df244340";
const FLASHLIGHT_ID = "69fe6454b236ccb9df244341";
const BLOODY_KNIFE_ID = "69fe6454b236ccb9df244342";
const WEDDING_RING_ID = "69fe6454b236ccb9df244343";

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
    deleteSave(gameID);
    window.location.href = "mainMenu.html";

});

document.addEventListener('DOMContentLoaded', function () {
    checkLogin();

    let easyReadOn = JSON.parse(sessionStorage.getItem("easyReadOn"));
    if (easyReadOn == true) {
        document.querySelector('.toolBar').style.fontFamily = 'Arial, Helvetica, sans-serif';
    }
    else {
        document.querySelector('.toolBar').style.fontFamily = '"Lugrasimo", cursive';
    }

    UpdateInventory();
    updateClueNotebook();
})





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


    //enable transition
    setTimeout(() => {
        toolbar.classList.remove('noTransition');
        inventoryContainer.classList.remove('noTransition');
        noteBookContainer.classList.remove('noTransition');
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
    let typingIndex = 0;
    // let totalTypingTime = currentState.description.length * 20;
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


    if (typeof currentState.interactions[responseId].response === 'string') {
        setResponse(currentState.interactions[responseId].response);
        document.getElementById('descriptionParagraph').textContent = currentState.description;

    }
    else {
        currentState.interactions[responseId].response(responseId);
    }
}


function setResponse(responseText) {
    const responseBox = document.getElementById('responseParagraph');
    responseBox.textContent = "";
    const responseLength = responseText.length;
    let totalTime = (2.26 * (Math.log(responseLength)).toFixed(2) - 8.48) * 1000;
    totalTime = Math.min(6000, totalTime)
    let intervalTime = totalTime / responseLength;
    intervalTime = Math.max(20, intervalTime)

    let typingIndex = 0;
    clearInterval(typingInterval);
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
    let typingIndex = 0;
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

    let typingIndex = 0;
    typingInterval = setInterval(() => {
        responseBox.textContent += responseText[typingIndex];
        typingIndex++;
        if (typingIndex == responseLength) {
            clearInterval(typingInterval);
        }

    }, intervalTime);
}


function UpdateInventory() {
    for (let i = 0; i < inventory.length; i++) {
        const slot = document.getElementById(`slot${i + 1}`);
        slot.innerHTML = '';
        if (inventory[i] != null && inventory[i].itemUsed == false) {
            let itemBtn = document.createElement('button');
            itemBtn.classList.add('itemBtn');
            itemBtn.value = inventory[i].itemID;
            itemBtn.id = `item${i + 1}`;
            itemBtn.addEventListener('click', selectInventoryItem);

            let itemImage = document.createElement('img');
            itemImage.src = inventory[i].itemHREF;
            itemImage.classList.add('itemImg');
            itemImage.alt = inventory[i].itemName;
            itemImage.title = inventory[i].itemName;
            itemBtn.appendChild(itemImage);
            slot.appendChild(itemBtn);
        }
    }

}

function selectInventoryItem(event) {
    const selectedItemBtn = event.currentTarget;

    for (let i = 0; i < inventory.length; i++) {
        document.getElementById(`item${i + 1}`).style.border = 'none';
    }

    selectedItemID = selectedItemBtn.value;
    selectedItemBtn.style.border = '8px solid yellow';


}


async function awardAchievement(achievementID, userID, achievementIconAddress) {

    let postBody = achievementID;

    try {
        response = await fetch("http://localhost:5257/api/Users/" + userID + "/addAchievement", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(postBody),
        });






        try {
            response = await fetch("http://localhost:5257/api/Users/achievement/" + achievementID, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (response.ok) {
                let result = await response.json();
                if (result != null) {
                    let achievement = result;
                    displayAchievement(achievementIconAddress, achievement.name, achievement.description)
                }
            }

            if (result.success && result.data.length > 0) {
                let achievement = result.data[0];
                displayAchievement(achievementIconAddress, achievement.name, achievement.description)
            }

        } catch (error) {
            console.log("Error retrieving achievement data");
            console.log(error);
        }

    } catch (error) {
        console.log("Error setting achievement");
        console.log(error);
    }
}

async function addClue(clueID) {


    try {
        let response = await fetch("http://localhost:5257/api/Users/clues/" + clueID, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (response.ok) {
            let result = await response.json();
            let clue = result;

            clueList.push(clue);
            sessionStorage.setItem('clueList', JSON.stringify(clueList));

            let insertResponse = await fetch("http://localhost:5257/api/Users/" + userID + "/" + gameID + "/clues/" + clueID, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify()
            });

            if (response.ok) {
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

    let alternateColour = false;
    let notificationTimer = setInterval(() => {
        if (alternateColour == false) {
            noteBookButton.style.color = 'rgb(228, 140, 68)';
            alternateColour = true;
        }
        else {
            noteBookButton.style.color = 'black';
            alternateColour = false
        }
    }, 400);


    setTimeout(() => {
        clearInterval(notificationTimer);
        noteBookButton.style.color = 'black';
    }, 2400);

}

function updateClueNotebook() {
    document.getElementById('clueList').innerHTML = '';
    for (let i = 0; i < clueList.length; i++) {
        let clueElement = document.createElement("li");
        clueElement.textContent = clueList[i].text;
        document.getElementById('clueList').appendChild(clueElement);
    }
}


async function addItem(itemID) {


    try {
        response = await fetch("http://localhost:5257/api/Users/item/" + itemID, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });


        if (response.ok) {
            let result = await response.json();

            let newItem = new Item();
            Object.assign(newItem, result);
            newItem.itemUsed = false;
            inventory.push(newItem);
            sessionStorage.setItem("inventory", JSON.stringify(inventory));
            UpdateInventory();






            let saveItemResponse = await fetch("http://localhost:5257/api/Users/" + userID + "/" + gameID + "/items/" + itemID, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify()
            });

            if (saveItemResponse.ok) {
                console.log("Item successfully added and saved");
            }
            else {
                console.error("Error occurred while saving the item to the inventory");
            }

        }
        else {
            console.error("Error saving the item to the inventory");
        }
    } catch (error) {
        console.log("Error adding the item to your inventory");
        console.log(error);
    }

    let alternateColour = false;
    let notificationTimer = setInterval(() => {
        if (alternateColour == false) {
            inventoryButton.style.color = 'rgb(228, 140, 68)';
            alternateColour = true;
        }
        else {
            inventoryButton.style.color = 'black';
            alternateColour = false
        }
    }, 400);


    setTimeout(() => {
        clearInterval(notificationTimer);
        inventoryButton.style.color = 'black';
    }, 2400);
}




async function saveGame() {

    let electricityOn = JSON.parse(sessionStorage.getItem("electricityOn"));
    let frontDoorUnlocked = JSON.parse(sessionStorage.getItem("frontDoorUnlocked"));
    let gameID = sessionStorage.getItem("gameID");
    let currentRoom = sessionStorage.getItem("currentRoom");
    let currentStateID = currentState.ID;



    let lightingOn = JSON.parse(sessionStorage.getItem("lightingOn"));
    let noGeneratorRepairAttempts = sessionStorage.getItem("noGeneratorRepairAttempts");
    let timesOnSofa = sessionStorage.getItem("timesOnSofa");





    let updateQuery = `UPDATE tblGameSave SET
                        electricityOn = ${electricityOn},
                        frontDoorUnlocked = ${frontDoorUnlocked},
                        currentRoom = '${currentRoom}',


                        currentState = ${currentStateID},
                        lightingOn = ${lightingOn},
                        noGeneratorRepairAttempts = ${noGeneratorRepairAttempts},
                        timesOnSofa = ${timesOnSofa}


                        WHERE gameID = ${gameID}`;

    let postBody = {
        gameId = gameID,
        electricityOn = electricityOn,
        frontDoorUnlocked = frontDoorUnlocked,
        currentRoom = currentRoom,
        currentStateID = currentStateID,
        lightingOn = lightingOn,
        noGeneratorRepairAttempts = noGeneratorRepairAttempts,
        timesOnSofa = timesOnSofa
    }

    

    try {
        let updateResponse = await fetch("http://localhost:5257/api/Users/" + userID + "/game/" + gameID, {
            method: "POST",
            body: JSON.stringify(postBody),
            headers: {
                "Content-Type": "application/json"
            }   
        });

        if (updateResponse.ok) {
            console.log("Game save successful");
        }
        else{
            console.error("Error occurred while saving the game");
        }

    } catch (error) {
        console.error("error saving the game", error);
    }

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
        document.querySelector('.toolBar').style.fontFamily = 'Arial, Helvetica, sans-serif';
    }
    else {
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


