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
const promptDivider = document.getElementById('promptDivider')

//VARIABLES
let currentState;
let selectedToolBarItem = null;

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
    document.querySelector('.rubbishContainer').style.display = 'none';

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

function UpdateInventory() {
    for (let i = 0; i < inventory.length; i++) {
        const slot = document.getElementById(`slot${i + 1}`);
        slot.innerHTML = '';
        if (inventory[i] != null && inventory[i].used == false) {
            itemBtn = document.createElement('button');
            itemBtn.style.width = '100%';
            itemBtn.style.height = '100%';
            itemBtn.style.background = `url("${inventory[i].itemHREF}")`;
            itemBtn.style.backgroundSize = "120% 120%";  // Ensures image fits
            itemBtn.style.backgroundRepeat = "no-repeat";
            itemBtn.style.backgroundPosition = "center";
            itemBtn.style.border = '8px solid transparent';
            itemBtn.value = inventory[i].itemID;
            itemBtn.id = `item${i + 1}`;
            itemBtn.addEventListener('click', selectInventoryItem);
            slot.appendChild(itemBtn);
        }
    }

}

function selectInventoryItem(event){
    const selectedItemBtn = event.target;
    
    for (let i = 0; i < inventory.length; i++) {
        document.getElementById(`item${i+1}`).style.border = 'none';
    }

    selectedItemID = selectedItemBtn.value;
    selectedItemBtn.style.border = '8px solid yellow';
   

}



