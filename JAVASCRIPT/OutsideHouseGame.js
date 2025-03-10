//Lead Developer = FINTAN MCIVOR
//The general layout for all game pages
// but the game logic such as the button functions and the minigames is coded by each of the lead devleoper for that page
// we all worked and discussed the best way in which to impleemtn interaction
// tooll bar -Fintan McIvor

//FOR DEVELOPMENT
sessionStorage.setItem("displayName", JSON.stringify("Fintan"));
sessionStorage.setItem("hasKey", JSON.stringify(false));
sessionStorage.setItem("electricityOn", JSON.stringify(false));
sessionStorage.setItem("doorUnlocked", JSON.stringify(false));
sessionStorage.setItem("clue1", JSON.stringify(false));
sessionStorage.setItem("inventory",JSON.stringify([]));

//VARIABLES
let selectedToolBarItem = null;
let displayName = JSON.parse(sessionStorage.getItem("displayName"));
let hasKey = JSON.parse(sessionStorage.getItem("hasKey"));
let electricityOn = JSON.parse(sessionStorage.getItem("electricityOn"));
let doorUnlocked = JSON.parse(sessionStorage.getItem("doorUnlocked"));
let clue1 = JSON.parse(sessionStorage.getItem("clue1"));
let inventory = JSON.parse(sessionStorage.getItem("inventory"));

let typingInterval;
let generatorAudio = new Audio("Audio/GeneratorStart.mp3");


//Minigame variables
let redZoneStart = Math.floor(Math.random() * 359);
let redZoneEnd = redZoneStart + 40;
let count = 0;
let angle = 1;
let generatorInterval;
let remainingRepairMisses = 2;


//CONSTANTS
const line = document.getElementById('line');
const circle = document.querySelector('.circle');
const clue1Btn = document.getElementById('clue1Btn');
const rubbishContainer = document.querySelector('.rubbishContainer');
const generatorProgressBar = document.getElementById('GeneratorProgressBar');
const rightColumn = document.querySelector(".rightColumn");

clue1Btn.addEventListener('click', function () {
    rightColumn.style.backgroundImage = 'URL("Images/rubbishNoNote.jpg")';
    clue1Btn.style.visibility = 'collapse';
    let clue = document.createElement("li");
    clue.textContent = "A letter dated the 27/03/2024 by Jonathan Donaghy contains threats and accusations that his loss of money and the failure of the business is victor's fault";
    document.getElementById('clueList').appendChild(clue);
    document.getElementById('responseParagraph').textContent = 'You have found a letter check your notebook to see its content';
    clue1 = true;


})

const repairButton = document.getElementById('repairButton');
repairButton.addEventListener('click', function () {

    let success = false;

    if (redZoneEnd > 360) {
        if (angle > redZoneStart && angle < 360 || angle > 0 && angle < redZoneEnd - 360) {
            success = true;
        }
    }
    else {
        if (angle > redZoneStart && angle < redZoneEnd) {
            success = true;
        }
    }

    if (success) {
        count++;
        generatorProgressBar.style.width = count * 33.3 + '%';

        if (count == 3) {
            clearInterval(generatorInterval);
            electricityOn =true;
            generatorAudio.currentTime = 0;
            generatorAudio.play();
            

        }
        else {

            redZoneStart = Math.floor(Math.random() * 359);
            redZoneEnd = redZoneStart + 40;

            if (redZoneEnd >= 360) {
                let additionalRedAngle = redZoneEnd - 360;
                circle.style.background = `linear-gradient(black, black) padding-box,
        conic-gradient(
            red 0deg, 
            red ${additionalRedAngle}deg, 
            black ${additionalRedAngle}deg, 
            black ${redZoneStart}deg, 
            red ${redZoneStart}deg, 
            red 360deg
        ) border-box`;
            }
            else {
                circle.style.background = `linear-gradient(black, black) padding-box,
                conic-gradient(
                    black 0deg, 
                    black ${redZoneStart}deg, 
                    red ${redZoneStart}deg, 
                    red ${redZoneEnd}deg, 
                    black ${redZoneEnd}deg, 
                    black 360deg
                ) border-box`;
            }

        }
        circle.style.width = '120px';
        circle.style.height = '120px';
        setTimeout(() => {
            circle.style.width = '100px';
            circle.style.height = '100px';
        }, 200);

    }
    else {
        remainingRepairMisses--;
        if (remainingRepairMisses === 0) {
            alert("you have used up all your attempts");
            clearInterval(generatorInterval);

            FixGenerator();


        }
    }


})

const startRepairButton = document.getElementById('startButton');
startRepairButton.addEventListener('click', startRepair);

function startRepair() {

    startRepairButton.style.display = 'none';
    repairButton.style.display = 'block';

    generatorInterval = setInterval(() => {
        line.style.transform = `rotate(${angle}deg)`;
        angle++;
        if (angle > 360) {
            angle = 1;
        }
    }, 7);


}


//Game interaction - front of house - side of house - shed 

let frontOfHouseDoorLocked = {
    "room": "Front of House",
    "description": `${displayName}, you stand infront of a large house with a locked door infront of you and a path leading to your left`,
    "ImageHREF": "Images/outsideHouse.jpg",
    "interactions": [
        {
            "id": 0,
            "Text": "Check under the mat",
            "response": checkUnderMat
        },
        {
            "id": 1,
            "Text": "Follow the path to your left",
            "response": goToSideOfHouse
        },
        {
            "id": 2,
            "Text": "Enter house",
            "response": "You can't enter the house with the door being locked"
        }
    ]
}

let frontOfHouseDoorUnlocked = {
    "room": "Front of House",
    "description": "You stand infront of a large house with a now unlocked door infront of you and a path leading to your left",
    "ImageHREF": "Images/outsideHouse.jpg",
    "interactions": [
        {
            "id": 0,
            "Text": "Check under the mat",
            "response": checkUnderMat
        },
        {
            "id": 1,
            "Text": "Follow the path to your left",
            "response": goToSideOfHouse
        },
        {
            "id": 2,
            "Text": "Enter house",
            "response": enterHouse
        }

    ]
}

let sideOfHouse = {
    "room": "Side of House",
    "description": `You now stand in an overgrown garden with a faint streetlight illuminating it. 
                    There is  a small building beside you with a locked door, 
                    however the window seems to be open. There is also a rubbish bin toppled over beside you`,
    "ImageHREF": "Images/outsideHouse.jpg",
    "interactions": [
        {
            "id": 0,
            "Text": "Climb into the building",
            "response": enterGeneratorBuilding
        },
        {
            "id": 1,
            "Text": "Search rubbish",
            "response": searchRubbish
        },
        {
            "id": 2,
            "Text": "Explore Garden",
            "response": exploreGarden
        },
        {
            "id": 3,
            "Text": "Go to the front of the house",
            "response": goTofrontOfHouse
        }

    ]
}

let generatorBuilding = {
    "room": "Front of House",
    "description": "There is an old generator with powerlines leading to the house. It appears to be broken.",
    "ImageHREF": "Images/Generator.jpg",
    "interactions": [
        {
            "id": 0,
            "Text": "Climb Out",
            "response": goToSideOfHouse
        },
        {
            "id": 1,
            "Text": "Fix the Generator",
            "response": FixGenerator
        }
    ]
}


let currentState = frontOfHouseDoorLocked;
let responseId = null;

function goToSideOfHouse() {
    currentState = sideOfHouse;
    updateState();

    generatorAudio.pause();
}

function checkUnderMat() {
    let button = document.getElementById(responseId);
    let responseParagraph = document.getElementById('responseParagraph');
    button.style.color = 'rgb(153, 153, 153)';
    button.querySelector('i').style.color = 'rgb(153, 153, 153)';

    if (hasKey) {
        responseParagraph.textContent = "There is nothing under here the key has already been taken";
    }
    else {
        responseParagraph.textContent = "There is a large golden key here and you lift it";
        hasKey = true;
        inventory.push({
            "id":1,
            "name":"key",
            "imgHREF":"Images/goldKey.png"
        });

        inventory.push({
            "id":2,
            "name":"key2",
            "imgHREF":"Images/goldKey.png"
        })

        UpdateInventory();

    }
}



function goTofrontOfHouse() {
    if (doorUnlocked) {
        currentState = frontOfHouseDoorUnlocked;
    }
    else {
        currentState = frontOfHouseDoorLocked;
    }

    updateState();
}



function searchRubbish(responseId) {
    let button = document.getElementById(responseId);
    let responseParagraph = document.getElementById('responseParagraph');
    responseParagraph.textContent = 'Click on the screen to try collect or find items in the rubbish';


    rubbishContainer.style.display = 'block';
    if (clue1) {
        clue1Btn.style.display = 'none';
        rightColumn.style.backgroundImage = 'url("Images/rubbishNoNote.jpg")';
    }
    else {
        clue1Btn.style.display = 'block';
        rightColumn.style.backgroundImage = 'url("Images/rubbish.jpg")';
    }
    button.style.color = 'rgb(153, 153, 153)';
    button.querySelector('i').style.color = 'rgb(153, 153, 153)';


}

function exploreGarden(responseId) {
    let button = document.getElementById(responseId);
    let responseParagraph = document.getElementById('responseParagraph');
    button.style.color = 'rgb(153, 153, 153)';
    button.querySelector('i').style.color = 'rgb(153, 153, 153)';


    responseParagraph.textContent = "You have walked through the garden and have come accross a section of uneven ground";
}

function enterGeneratorBuilding() {
    currentState = generatorBuilding;
    updateState();
    if (electricityOn) {
        document.getElementById('1').remove();
    }

}

function FixGenerator() {
    clearInterval(generatorInterval);
    line.style.transform = 'rotate(0deg)';
    angle = 1;
    generatorProgressBar.style.width = '0';
    redZoneStart = Math.floor(Math.random() * 359);
    redZoneEnd = redZoneStart + 40;
    count = 0;
    startRepairButton.style.display = 'block';
    repairButton.style.display = 'none';

    document.getElementById('GeneratorGameContainer').style.display = 'flex';

    if (redZoneEnd <= 360) {
        circle.style.background = `linear-gradient(black, black) padding-box,
    conic-gradient(
        black 0deg, 
        black ${redZoneStart}deg, 
        red ${redZoneStart}deg, 
        red ${redZoneEnd}deg, 
        black ${redZoneEnd}deg, 
        black 360deg
    ) border-box`;

    }
    else {
        let additionalRedAngle = redZoneEnd - 360;
        circle.style.background = `linear-gradient(black, black) padding-box,
    conic-gradient(
        red 0deg, 
        red ${additionalRedAngle}deg, 
        black ${additionalRedAngle}deg, 
        black ${redZoneStart}deg, 
        red ${redZoneStart}deg, 
        red 360deg
    ) border-box`;
    }


}





function enterHouse() {
    sessionStorage.setItem("hasKey", hasKey);
    sessionStorage.setItem("electricityOn", electricityOn);
    sessionStorage.setItem("doorUnlocked", doorUnlocked);
    sessionStorage.setItem("clue1", clue1);
}

function updateState() {
    const roomHeader = document.getElementById('roomHeader');
    const description = document.getElementById('descriptionParagraph');
    const responseParagraph = document.getElementById('responseParagraph').textContent = '';
    const buttonContainer = document.getElementById('buttonContainer');
    const stateImageHref = currentState.ImageHREF;
    buttonContainer.innerHTML = '';
    roomHeader.textContent = currentState.room;
    description.textContent = "";
    let typingIndex = 0;
    clearInterval(typingInterval);
    typingInterval = setInterval(() => {
        description.textContent += currentState.description[typingIndex];
        typingIndex++;
        if (typingIndex == currentState.description.length) {
            clearInterval(typingInterval);
        }

    }, 25);
    document.querySelector('.rightColumn').style.backgroundImage = `url("${stateImageHref}")`;
    document.querySelector('.gameContainer').style.display = 'none';
    document.querySelector('.rubbishContainer').style.display = 'none';

    currentState.interactions.forEach(interaction => {

        let button = document.createElement('button');
        button.classList.add('optionButton');
        button.id = interaction.id;
        button.innerHTML = `<i id="${interaction.id}" class="fa-solid fa-caret-right"></i>&nbsp ${interaction.Text}`;
        button.addEventListener('click', userDecisionHandler);
        buttonContainer.appendChild(button);

    });

}

updateState();

function userDecisionHandler(event) {
    responseId = event.target.id;


    if (typeof currentState.interactions[responseId].response === 'string') {
        document.getElementById('responseParagraph').textContent = currentState.interactions[responseId].response;
    }
    else {
        currentState.interactions[responseId].response(responseId);
    }
}



document.getElementById('useItemBtn').addEventListener('click', function () {
    if (hasKey === true) {
        if (currentState === frontOfHouseDoorLocked) {
            currentState = frontOfHouseDoorUnlocked;
            updateState();
            document.getElementById('responseParagraph').textContent = 'You have unlocked the door now';
            doorUnlocked = true;

        }
        else {
            document.getElementById('responseParagraph').textContent = 'The door has already been unlocked';

        }

    }
    else {
        document.getElementById('responseParagraph').textContent = 'You cannot open the door without a key';
    }

})

function UpdateInventory(){
    for (let i = 0; i < inventory.length; i++) {
        const slot = document.getElementById(`slot${i+1}`);
        slot.innerHTML = '';
        if (inventory[i] !=null) {
            itemBtn = document.createElement('button');
            itemBtn.style.width = '100%';
            itemBtn.style.height = '100%';
            itemBtn.style.background = `url("${inventory[i].imgHREF}")`;
            itemBtn.style.backgroundSize = "contain";  // Ensures image fits
            itemBtn.style.backgroundRepeat = "no-repeat";
            itemBtn.style.backgroundPosition = "center";
            itemBtn.value = i+1;
            itemBtn.addEventListener('click',selectInventoryItem);
            slot.appendChild(itemBtn);
        }
    }
    
}

function selectInventoryItem(event){
    const selectedItem = event.target;
    const slotId = selectedItem.value;

    const slot = document.getElementById(`slot${slotId}`);
    slot.style.background = 'yellow';

    for (let i = 1; i < 7; i++) {
        if (i != slotId) {
            document.getElementById(`slot${i}`).style.background = 'rgb(228, 140, 68)';
        }
        
    }

    
}