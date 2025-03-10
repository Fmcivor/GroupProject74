//Lead Developer = FINTAN MCIVOR
//The general layout for all game pages
// but the game logic such as the button functions and the minigames is coded by each of the lead devleoper for that page
// we all worked and discussed the best way in which to impleemtn interaction
// tooll bar -Fintan McIvor

//VARIABLES
let selectedToolBarItem = null;
let hasKey = true;
let electricityOn = false;
let doorUnlocked = false;
let clue1 = false;


//CONSTANTS
const toolbar = document.querySelector('.toolBar');
const inventoryButton = document.getElementById('inventoryButton');
const noteBookButton = document.getElementById('noteBookButton');
const hideToolBarButton = document.getElementById('hideToolBarButton');
const noteBookContainer = document.getElementById('noteBook');
const inventoryContainer = document.getElementById('inventory');
const promptDivider = document.getElementById('promptDivider')

//EVENT LISTENERS
inventoryButton.addEventListener('click', showInventory);
noteBookButton.addEventListener('click', showNoteBook);
hideToolBarButton.addEventListener('click', hideToolBar);


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
    selectedToolBarItem = null;
    hideToolBarButton.classList.remove('visible');
    toolbar.classList.remove('toolBarExpanded');

    setTimeout(() => {
        noteBookContainer.classList.remove('displayNoteBook');
        inventoryContainer.classList.remove('displayInventory');
    }, 1000);

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

let frontOfHouseDoorLocked = {
    "room": "Front of House",
    "description": "You stand infront of a large house with a locked door infront of you and a path leading to your left",
    "interactions": [
        {
            "id": 0,
            "Text": "Unlock door",
            "response": unlockDoor
        },
        {
            "id": 1,
            "Text": "Follow the path to your left",
            "response": goToSideOfHouse
        }
    ]
}

let frontOfHouseDoorUnlocked = {
    "room": "Front of House",
    "description": "You stand infront of a large house with a now unlocked door infront of you and a path leading to your left",
    "interactions": [
        {
            "id": 0,
            "Text": "Enter house",
            "response": enterHouse
        },
        {
            "id": 1,
            "Text": "Follow the path to your left",
            "response": goToSideOfHouse
        }
    ]
}

let sideOfHouse = {
    "room": "Side of House",
    "description": "You stand to the left of the house with an old building infront of you along with a very overgrown garden and a pile of rubbish to your left ",
    "interactions": [
        {
            "id": 0,
            "Text": "Approach building",
            "response": approachGenerator
        },
        {
            "id": 1,
            "Text": "Search rubbish",
            "response": exploreRubbish
        },
        {
            "id": 2,
            "Text": "Go to the front of the house",
            "response": goTofrontOfHouse
        }

    ]
}

let currentState = frontOfHouseDoorLocked;
let responseId = null;

function goToSideOfHouse() {
    currentState = sideOfHouse;
    updateState();
}

function goTofrontOfHouse() {
    currentState = frontOfHouseDoorLocked;
    updateState();
}

function approachGenerator() {

}

function exploreRubbish() {
    if (clue1) {
        document.getElementById('responseParagraph').textContent = "There is nothing here except old waste";

    }
    else{
        document.getElementById('responseParagraph').textContent = "There is an old note lying here you take it.It can be read in your notebook";
        clue1 = true;
        
    }
}
 
function unlockDoor() {    

}

function enterHouse() {

}

function updateState() {
    const roomHeader = document.getElementById('roomHeader');
    const mobileHeader = document.getElementById('mobileHeader')
    const description = document.getElementById('descriptionParagraph');
    const responseParagraph = document.getElementById('responseParagraph').textContent = '';
    const buttonContainer = document.getElementById('buttonContainer');
    buttonContainer.innerHTML = '';
    roomHeader.textContent = currentState.room;
    mobileHeader.textContent = currentState.room;
    description.textContent = currentState.description;

    

    currentState.interactions.forEach(interaction => {

       let button = document.createElement('button');
       button.classList.add('optionButton');
       button.id = interaction.id;
       button.innerHTML = `<i id="${interaction.id}" class="fa-solid fa-caret-right"></i>&nbsp <p id="${interaction.id}">${interaction.Text}</p>`;
       button.addEventListener('click', buttonHandler);
       buttonContainer.appendChild(button);
    });
    
}

updateState();

function buttonHandler(event) {
    responseId = event.target.id;

    console.log(responseId)
    if (typeof currentState.interactions[responseId].response === 'string') {

    }
    else {
        currentState.interactions[responseId].response();
    }
}