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
const exitAndSaveBtn = document.getElementById('exitAndSaveBtn');


// item ids
const keyID = 1;

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
UpdateInventory();
updateClueNotebook();


//EVENT LISTENERS
inventoryButton.addEventListener('click', showInventory);
noteBookButton.addEventListener('click', showNoteBook);
hideToolBarButton.addEventListener('click', hideToolBar);
settingsButton.addEventListener('click', toggleSettings);
exitAndSaveBtn.addEventListener('click',async function(){
    await saveGame();
    window.location.href = "mainMenu.html";
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
    else{
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
    buttonContainer.innerHTML = '';
    roomHeader.textContent = currentState.room;
    description.textContent = "";

    //typing effect
    let typingIndex = 0;
    let totalTypingTime = currentState.description.length * 20;
    clearInterval(typingInterval);
    typingInterval = setInterval(() => {
        description.textContent += currentState.description[typingIndex];
        typingIndex++;
        if (typingIndex == currentState.description.length) {
            clearInterval(typingInterval);
        }

    }, 20);


    //background image
    document.querySelector('.rightColumn').style.backgroundImage = `url("${stateImageHref}")`;
    document.querySelector('.gameContainer').style.display = 'none';
    // document.querySelector('.rubbishContainer').style.display = 'none';

    //dynamic buttons


    currentState.interactions.forEach(interaction => {

        let button = document.createElement('button');
        button.classList.add('optionButton');
        button.id = interaction.id;
        button.innerHTML = `<i id="${interaction.id}" class="fa-solid fa-caret-right"></i>&nbsp ${interaction.Text}`;
        button.addEventListener('click', userDecisionHandler);
        button.setAttribute('disabled', true);
        buttonContainer.appendChild(button);

    });

    setTimeout(() => {
        const optionBtns = document.querySelectorAll('.optionButton');
        optionBtns.forEach(btn => {
            btn.removeAttribute('disabled');
        });
    }, totalTypingTime);

}


function userDecisionHandler(event) {
    responseId = event.target.id;


    if (typeof currentState.interactions[responseId].response === 'string') {
        document.getElementById('responseParagraph').textContent = currentState.interactions[responseId].response;
    }
    else {
        currentState.interactions[responseId].response(responseId);
    }
}

function setResponse(responseText) {
    document.getElementById('responseParagraph').textContent = responseText;
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


async function awardAchievement(achievementID, userID) {
    let query = `INSERT INTO tblUserAchievements (achievementID, userID) VALUES (${achievementID}, ${userID});`;

    dbConfig.set('query', query);

    try {
        response = await fetch(dbConnectorUrl, {
            method: "POST",
            body: dbConfig
        });

    } catch (error) {
        console.log("Error setting achievement");
        console.log(error);
    }
}

async function addClue(clueID){
    let selectQuery = `SELECT * FROM tblClue WHERE clueID = ${clueID}`;

    dbConfig.set('query',selectQuery);

    try {
        let response  = await fetch(dbConnectorUrl,{
            method:"POST",
            body:dbConfig
        });

        let result = await response.json();

        if (result.success && result.data.length >0) {
            let clue = result.data[0];
            let clueToAdd = new Clue(clue.clueID,clue.clueText);
            clueList.push(clueToAdd);
            sessionStorage.setItem('clueList',JSON.stringify(clueList));

            hasClue1 = true;
            
            let insertQuery = `INSERT INTO tblGameNotebook (gameID,clueID) VALUES(${gameID},${clueToAdd.clueID})`;

            dbConfig.set('query',insertQuery);

            let insertResponse = await fetch(dbConnectorUrl,{
                method:"POST",
                body:dbConfig
            });

            let insertResult = await insertResponse.json();
            if (insertResult.success) {
                console.log("Clue successfully added and saved");
            }
            else{
                console.error("An error has occurred while recording the clue in the database");
            }
        }
        else{
            console.error("An error has occurred while retrieving the clue form the database");
        }
    } catch (error) {
        console.error("An error has occurred while adding the clues to the notebook",error);
    }

}

function updateClueNotebook(){
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
                sessionStorage.setItem("inventory",JSON.stringify(inventory));
                hasKey = true;
                UpdateInventory();

                let saveItemQuery = `INSERT INTO tblGameInventory (GameID,itemID)
                                     VALUES(${sessionStorage.getItem("gameID")},${keyID})`;
                dbConfig.set("query",saveItemQuery);

                let saveItemResponse = await fetch(dbConnectorUrl,{
                    method:"POST",
                    body:dbConfig
                });

                let saveItemResult = await saveItemResponse.json();

                if (saveItemResult.success) {
                    console.log("Inventory Updated Successfully");
                }
                else{
                    console.error("Error saving the item to the inventory");
                }
            }
            else{
                console.error("Error saving the item to the inventory");
            }
        } catch (error) {
            console.log("Error adding the item to your inventory");
            console.log(error);
        }
}




async function saveGame(){
    let electricityOn = sessionStorage.getItem("electricityOn");
    let frontDoorUnlocked = JSON.parse(sessionStorage.getItem("frontDoorUnlocked"));
    let gameID = sessionStorage.getItem("gameID");
    let currentRoom = sessionStorage.getItem("currentRoom");
    let currentStateID = currentState.ID;
    let noGeneratorRepairAttempts = sessionStorage.getItem('noGeneratorRepairAttempts');
    let timesOnSofa = sessionStorage.getItem('timesOnSofa');


    let updateQuery = `UPDATE tblGameSave SET
                        electricityOn = ${electricityOn},
                        frontDoorUnlocked = ${frontDoorUnlocked},
                        currentRoom = '${currentRoom}',
                        currentState = ${currentStateID},
                        noGeneratorRepairAttempts=${noGeneratorRepairAttempts},
                        timesOnSofa = ${timesOnSofa}
                        WHERE gameID = ${gameID}`;

    dbConfig.set("query",updateQuery);

    try {
        let updateResponse = await fetch(dbConnectorUrl,{
            method:"POST",
            body:dbConfig
        });

        let updateResult = await updateResponse.json();

        if (updateResult.success) {
            console.log("game successfully saved");
        }
        else{
            console.error("error saving the game")
        }
    } catch (error) {
        onsole.error("error saving the game")
    }
    
 }


