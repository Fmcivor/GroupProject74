//Lead Developer = FINTAN MCIVOR


//VARIABLES


let doorUnlocked = JSON.parse(sessionStorage.getItem("frontDoorUnlocked"));
let lightingOn = JSON.parse(sessionStorage.getItem("lightingOn"));

let hasKey = inventory.some(item => item.itemID == keyID);
let hasRubbishClue = clueList.some(clue => clue.clueID == rubbishClueID);
let hasGeneratorAchievement = userAchievementIDs.some(achievement =>achievement.achievementID == 2);


let noGeneratorRepairAttempts = sessionStorage.getItem("noGeneratorRepairAttempts");
let selectedItemID = null;

let generatorAudio = new Audio("Audio/GeneratorStart.mp3");


//Minigame variables 
let redZoneStart = Math.floor(Math.random() * 359);
let redZoneEnd = redZoneStart + 40;
let count = 0;
let angle = 1;
let generatorInterval;
let remainingRepairMisses = 2;

document.querySelector('.gameContainer').style.display = 'none';

//CONSTANTS - mainly html elements to save repetition of document.getelement call
const line = document.getElementById('line');
const circle = document.querySelector('.circle');
const clue1Btn = document.getElementById('clue1Btn');
const generatorProgressBar = document.getElementById('GeneratorProgressBar');
const startRepairButton = document.getElementById('startButton');
const repairButton = document.getElementById('repairButton');
const rubbishContainer = document.querySelector('.rubbishContainer');
startRepairButton.addEventListener('click', startRepair);


//CLASS
// let key = new item(1, "key", "Images/goldKey.png");




//GAME STATES

const frontOfHouseDoorLocked = {
    "ID": 1,
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

const frontOfHouseDoorUnlocked = {
    "ID": 2,
    "room": "Front of House",
    "description": "You stand infront of a large house with an unlocked door infront of you and a path leading to your left",
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

const sideOfHouse = {
    "ID": 3,
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

const generatorBuilding = {
    "ID": 4,
    "room": "Generator Building",
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

const generatorFixed = {
    "ID": 5,
    "room": "Generator Building",
    "description": "There is an old generator with powerlines leading to the house. You have already fixed it and it now provides elecrtricity to the house.",
    "ImageHREF": "Images/Generator.jpg",
    "interactions": [
        {
            "id": 0,
            "Text": "Climb Out",
            "response": goToSideOfHouse
        }
    ]
}


document.addEventListener('DOMContentLoaded', async function () {

    let states = [];

    states.push(frontOfHouseDoorLocked, frontOfHouseDoorUnlocked, sideOfHouse, generatorBuilding);

  
    let currentStateID = Number(sessionStorage.getItem('currentState'));
    states.forEach(state => {
        if (state.ID == currentStateID) {
            if (state.ID == 1 && doorUnlocked) {
                currentState = frontOfHouseDoorUnlocked;
                currentStateID = frontOfHouseDoorUnlocked.ID;
            }
            else {
                currentState = state;

            }
            return;
        }
    });

    updateState();

})


//GANE RESPONSE FUNCTIONS

function goToSideOfHouse() {
    currentState = sideOfHouse;
    updateState();
    clearInterval(generatorInterval);

    generatorAudio.pause();
}


async function checkUnderMat() {
    let button = document.getElementById(responseId);
    button.style.color = 'rgb(153, 153, 153)';
    button.querySelector('i').style.color = 'rgb(153, 153, 153)';

    if (hasKey) {
        setResponse("There is nothing under here the key has already been taken");
    }
    else {
        setResponse("There is a large golden key here and you lift it");
        addItem(keyID);
        hasKey = true;
    }
}



async function enterHouse(){
    if (lightingOn == false) {
        sessionStorage.setItem('currentState',1);
        sessionStorage.setItem('currentRoom','downStairsHall.html');
    }
    else{
        sessionStorage.setItem('currentState',3);
        sessionStorage.setItem('currentRoom','downStairsHall.html');
    }

    await saveGame();
    window.location.replace('downStairsHall.html');
}

function goTofrontOfHouse() {
    if (doorUnlocked == true) {
        currentState = frontOfHouseDoorUnlocked;
    }
    else {
        currentState = frontOfHouseDoorLocked;
    }
    rubbishContainer.style.display = 'none';
    updateState();
}



function searchRubbish(responseId) {
    let button = document.getElementById(responseId);
    setResponse('Click on the screen to try collect or find items in the rubbish');

    rubbishContainer.style.display = 'block';
    if (hasRubbishClue) {
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
    button.style.color = 'rgb(153, 153, 153)';
    button.querySelector('i').style.color = 'rgb(153, 153, 153)';


    setResponse("You have walked through the garden and have come accross a section of uneven ground");
}


function enterGeneratorBuilding() {


    if (electricityOn) {
        currentState = generatorFixed;
    }
    else {
        currentState = generatorBuilding;
    }
    rubbishContainer.style.display = 'none';

    updateState();
}




function FixGenerator() {
    clearInterval(generatorInterval);
    line.style.transform = 'rotate(0deg)';
    document.getElementById('hammerIcon').style.transform = 'rotate(0deg)';
    angle = 1;
    generatorProgressBar.style.width = '0';
    redZoneStart = Math.floor(Math.random() * 359);
    redZoneEnd = redZoneStart + 40;
    count = 0;
    startRepairButton.style.display = 'block';
    repairButton.style.display = 'none';
    setResponse("You must click on the repair button when the line is in the red zone 3 times. You have 2 miss hits before you have to try again");

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

function startRepair() {
    noGeneratorRepairAttempts++;
    startRepairButton.style.display = 'none';
    repairButton.style.display = 'block';
    const hammer = document.getElementById('hammerIcon');

    generatorInterval = setInterval(() => {
        line.style.transform = `rotate(${angle}deg)`;
        hammer.style.transform = `rotate(${angle}deg)`;
        angle++;
        if (angle > 360) {
            angle = 1;
        }
    }, 7);
}


repairButton.addEventListener('click', async function () {

    let success = false;

    if (redZoneEnd > 360) {
        if (angle >= redZoneStart && angle <= 360 || angle >= 0 && angle <= redZoneEnd - 360) {
            success = true;
        }
    }
    else {
        if (angle >= redZoneStart && angle <= redZoneEnd) {
            success = true;
        }
    }

    if (success) {
        count++;
        generatorProgressBar.style.width = count * 33.3 + '%';

        if (count == 3) {
            clearInterval(generatorInterval);
            electricityOn = true;
            sessionStorage.setItem("electricityOn", JSON.stringify(electricityOn));
            generatorAudio.currentTime = 0;
            generatorAudio.play();
            electricityOn = true;
            document.getElementById('GeneratorGameContainer').style.display = 'none';
            generatorBuilding.interactions.pop();
            updateState();
            setResponse("You have successfully repaired the generator.");
            
            if (remainingRepairMisses == 2 && noGeneratorRepairAttempts == 1 && hasGeneratorAchievement == false) {
                awardAchievement(2, userID, "Images/generatorAchievement.png");
                hasGeneratorAchievement = true;
            }

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
            remainingRepairMisses = 2;
            clearInterval(generatorInterval);
            FixGenerator();
            setResponse("You missed the zone too many times. Try again.");

        }
    }


})


clue1Btn.addEventListener('click', async function () {
    rightColumn.style.backgroundImage = 'URL("Images/rubbishNoNote.jpg")';
    clue1Btn.style.visibility = 'collapse';
    hasRubbishClue = true;
    await addClue(rubbishClueID);
    updateClueNotebook();
    setResponse('You have found a letter check your notebook to see its content');


})




document.getElementById('useItemBtn').addEventListener('click', function () {


    if (selectedItemID != null) {
        if (currentState == frontOfHouseDoorLocked && selectedItemID == keyID) {
            currentState = frontOfHouseDoorUnlocked;
            updateState();

            doorUnlocked = true;
            sessionStorage.setItem('frontDoorUnlocked', JSON.stringify(doorUnlocked));
        }
        else {
            setResponse("That didn't do anything, maybe try something else.");
        }
    }
    else {

        setResponse("You must select an item before you can use it");
    }

})
