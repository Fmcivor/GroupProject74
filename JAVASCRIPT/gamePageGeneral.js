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

const keyID = 1;


//VARIABLES
let currentState;
let selectedToolBarItem = null;
let typingInterval;

let electricityOn = JSON.parse(sessionStorage.getItem("electricityOn"));
let userID = sessionStorage.getItem("userID");
let displayName = sessionStorage.getItem("displayName");


//EVENT LISTENERS
inventoryButton.addEventListener('click', showInventory);
noteBookButton.addEventListener('click', showNoteBook);
hideToolBarButton.addEventListener('click', hideToolBar);

//CLASSES
class Item {
    constructor(itemID, itemName, itemHREF) {
        this.itemID = itemID;
        this.itemName = itemName;
        this.itemHREF = itemHREF;
        this.used = false;
    }
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
    let totalTypingTime = currentState.description.length*20;
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
        button.setAttribute('disabled',true);
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
    for (let i =  0; i < inventory.length; i++) {
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

function selectInventoryItem(event){
    const selectedItemBtn = event.currentTarget;
    
    for (let i = 0; i < inventory.length; i++) {
        document.getElementById(`item${i+1}`).style.border = 'none';
    }

    selectedItemID = selectedItemBtn.value;
    selectedItemBtn.style.border = '8px solid yellow';
   

}

function addClue(clueContent) {
    let clue = document.createElement("li");
    clue.textContent = clueContent;
    document.getElementById('clueList').appendChild(clue);
}

async function awardAchievement(achievementID, userID){
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


