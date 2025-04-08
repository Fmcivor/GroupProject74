//Lead Developer - FINTAN MCIVOR


//VARIABLES


let doorUnlocked = JSON.parse(sessionStorage.getItem("frontDoorUnlocked"));
let lightingOn = JSON.parse(sessionStorage.getItem("lightingOn"));

let hasKey;
let hasRubbishClue;
let hasGeneratorAchievement;

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
let notches = Array.from(document.querySelectorAll('.notch'));


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
    "description": `${displayName}, you stand infront of a large house with a door infront of you and boarded up windows, you can see no way inside and a path leading to your left.It seems to be a garden of sorts over to the left.`,
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

const frontOfHouseDoorUnlocked = {
    "ID": 2,
    "room": "Front of House",
    "description": `${displayName}, you stand infront of a large house with a door infront of you and boarded up windows, you have already unlocked the door and a path leading to your left.It seems to be a garden of sorts over to the left.`,
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
    "description": "There is an old generator with powerlines leading to the house. It appears to be broken. Maybe this could help with our investigation.",
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
    "description": "You have visited the generator building and have repaired the generator. It now provides electricity to the house.",
    "ImageHREF": "Images/Generator.jpg",
    "interactions": [
        {
            "id": 0,
            "Text": "Climb Out",
            "response": goToSideOfHouse
        }
    ]
}

const overgrownGarden = {
    "ID": 6,
    "room": "Overgrown Garden",
    "description": `You step deeper into the garden, where tangled vines and wildflowers surround you. 
                    Surrounded by the overgrown foliage, you think maybe a something could be hidden here
                    The faint sound of rustling in the bushes catches your attention, and the smell of damp earth is overpowering.`,
    "ImageHREF": "Images/outsideHouse.jpg",
    "interactions": [
        {
            "id": 0,
            "Text": "Search the bushes",
            "response": searchBushes
        },
        {
            "id": 1,
            "Text": "Investigate the rustling sound",
            "response": investigateRustling
        },
        {
            "id": 2,
            "Text": "Go back to the side of the house",
            "response": goToSideOfHouse
        }
    ]
}


document.addEventListener('DOMContentLoaded', async function () {

    let states = [];

    states.push(frontOfHouseDoorLocked, frontOfHouseDoorUnlocked, sideOfHouse, generatorBuilding, generatorFixed, overgrownGarden);


    let currentStateID = Number(sessionStorage.getItem('currentState'));
    currentState = states.find(state => state.ID == currentStateID) || frontOfHouseDoorLocked;

    if (currentState.ID == frontOfHouseDoorLocked.ID && doorUnlocked == true) {
        currentState = frontOfHouseDoorUnlocked;
    }
    else if (currentState.ID == frontOfHouseDoorUnlocked.ID && doorUnlocked == false) {
        currentState = frontOfHouseDoorLocked;
    }

    hasKey = inventory.some(item => item.itemID == keyID);
    hasRubbishClue = clueList.some(clue => clue.clueID == rubbishClueID);
    hasGeneratorAchievement = userAchievementIDs.some(achievement => achievement.achievementID == 2);

    updateState();

})


//GANE RESPONSE FUNCTIONS

function goToSideOfHouse() {
    currentState = sideOfHouse;
    updateState();
    clearInterval(generatorInterval);
    document.getElementById('GeneratorGameContainer').style.display = 'none';
    generatorAudio.pause();
}


async function checkUnderMat() {
    let button = document.getElementById(responseId);
    button.querySelector('i').style.color = 'rgb(153, 153, 153)';

    if (hasKey) {
        setResponse("There is nothing under here the key has already been taken");
    }
    else {
        inventory.filter(item => item.itemUsed == false).length;
        if (inventory.filter(item => item.itemUsed == false).length == 6) {
            setResponse("You must drop an item before you can pick up the key. HINT try using an item to get rid of it.");
        }
        else {
            hasKey = true;
            await addItem(keyID);
            setResponse("There is a large golden key here and you lift it");
        }
    }
}


async function enterHouse() {


    if (doorUnlocked) {
        if (lightingOn == false) {
            await goToNextRoom('downStairsHall.html', 1);
        }
        else {
            await goToNextRoom('downStairsHall.html', 3);
        }
    }
    else {
        setResponse("The door is locked, maybe you could find a way to open it...");
    }


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
    rightColumn.style.backgroundImage = 'url("Images/rubbish2.png")';

    rubbishContainer.style.display = 'flex';
    if (hasRubbishClue) {
        clue1Btn.style.display = 'none';
    }
    else {
        clue1Btn.style.display = 'block';
    }
    button.querySelector('i').style.color = 'rgb(153, 153, 153)';
}

document.getElementById('postCardContainer').addEventListener('click', function () {
    document.getElementById('postCardContainer').style.display = 'none';
});


function exploreGarden() {
    currentState = overgrownGarden;
    updateState();
}

function searchBushes() {
    setResponse(`OUCH. ${displayName.toUpperCase()}! You reach into the bushes, but a thorny vine scratches your hand, and you find nothing for your troubles.`);

}

function investigateRustling() {
    setResponse(`You approach the bushes cautiously, heart racing. As you get closer, the rustling stops. You peer into the foliage, but it’s just a squirrel scurrying away.`);

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
    setResponse("You must click on the repair button when the line is in the red zone 5 times. You have 2 miss hits before you have to try again");

    document.getElementById('GeneratorGameContainer').style.display = 'flex';

    if (redZoneEnd <= 360) {
        circle.style.background = `linear-gradient(black, black) padding-box,
    conic-gradient(
        rgb(78,78, 78) 0deg, 
        rgb(78,78, 78) ${redZoneStart}deg, 
        rgb(200,44, 44) ${redZoneStart}deg, 
        #4B0000 ${redZoneEnd}deg, 
        rgb(78,78, 78) ${redZoneEnd}deg, 
        rgb(78,78, 78) 360deg
    ) border-box`;

    }
    else {
        let additionalRedAngle = redZoneEnd - 360;
        circle.style.background = `linear-gradient(black, black) padding-box,
    conic-gradient(
        rgb(200,44, 44) 0deg, 
        #4B0000 ${additionalRedAngle}deg, 
        rgb(78,78, 78) ${additionalRedAngle}deg, 
        rgb(78,78, 78) ${redZoneStart}deg, 
        rgb(200,44, 44) ${redZoneStart}deg, 
        #4B0000 360deg
    ) border-box`;
    }

}

function startRepair() {
    noGeneratorRepairAttempts++;
    sessionStorage.setItem("noGeneratorRepairAttempts", noGeneratorRepairAttempts);
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
    }, 5);
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
        generatorProgressBar.style.width = count * 20 + '%';

        switch (count) {
            case 1:
                notches.forEach(notch => {
                    notch.style.backgroundColor = ' rgba(24, 48, 98, 0.4)';
                });
                setGeneratorHitZone();
                break;
            case 2:
                notches.forEach(notch => {
                    notch.style.backgroundColor = ' rgba(32, 65, 138, 0.51)'
                });

                setGeneratorHitZone();
                break;
            case 3:
                notches.forEach(notch => {
                    notch.style.backgroundColor = ' rgba(36, 81, 180, 0.64)'
                });
                setGeneratorHitZone();
                break;
            case 4:
                notches.forEach(notch => {
                    notch.style.backgroundColor = ' rgba(51, 104, 220, 0.89)'
                });

                setGeneratorHitZone();
                break;
            case 5:
                notches.forEach(notch => {
                    notch.style.backgroundColor = 'rgb(64, 128, 255)';
                });

                clearInterval(generatorInterval);
                electricityOn = true;
                sessionStorage.setItem("electricityOn", JSON.stringify(electricityOn));
                generatorAudio.currentTime = 0;
                generatorAudio.play();
                electricityOn = true;
                // document.getElementById('GeneratorGameContainer').style.display = 'none';
                document.querySelector('.miniGameFunctionContainer').style.visibility = 'hidden';

                circle.style.background = 'rgb(78,78,78)';
                if (angle % 4 !== 0) {
                    angle += (4 - (angle % 4));
                }
                rotateLine();


                generatorBuilding.interactions.pop();
                const buttonContainer = document.getElementById('buttonContainer');
                buttonContainer.removeChild(buttonContainer.lastChild);
                setResponse("You have successfully repaired the generator.");

                if (remainingRepairMisses == 2 && noGeneratorRepairAttempts == 1 && hasGeneratorAchievement == false) {
                    awardAchievement(2, userID, "Images/generatorAchievement.png");
                    hasGeneratorAchievement = true;
                }
                break;
        }


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

let intervalTime = 7;


function rotateLine() {
    line.style.transform = `rotate(${angle}deg)`;

    angle += 4;

    if (angle > 360) {
        angle = 4;
    }

    if (angle % 180 == 0) {
        intervalTime -= 0.5;
    }



    if (intervalTime > 0.5) {
        setTimeout(rotateLine, intervalTime);
    }
    else {
        document.getElementById('GeneratorGameContainer').style.display = 'none';
    }
}

clue1Btn.addEventListener('click', async function () {
    clue1Btn.style.visibility = 'collapse';
    hasRubbishClue = true;
    await addClue(rubbishClueID);
    setResponse('You have found a letter check your notebook to see its content');
    document.getElementById('postCardContainer').style.display = 'block';


})


function setGeneratorHitZone() {
    redZoneStart = Math.floor(Math.random() * 359);
    redZoneEnd = redZoneStart + 40;

    if (redZoneEnd >= 360) {
        let additionalRedAngle = redZoneEnd - 360;
        circle.style.background = `linear-gradient(black, black) padding-box,
conic-gradient(
rgb(200,44, 44) 0deg, 
#4B0000 ${additionalRedAngle}deg, 
rgb(78,78, 78) ${additionalRedAngle}deg, 
rgb(78,78, 78) ${redZoneStart}deg, 
rgb(200,44, 44) ${redZoneStart}deg, 
#4B0000 360deg
) border-box`;
    }
    else {
        circle.style.background = `linear-gradient(black, black) padding-box,
    conic-gradient(
        rgb(78,78, 78) 0deg, 
        rgb(78,78, 78) ${redZoneStart}deg, 
        rgb(200,44, 44) ${redZoneStart}deg, 
        #4B0000 ${redZoneEnd}deg, 
        rgb(78,78, 78) ${redZoneEnd}deg, 
        rgb(78,78, 78) 360deg
    ) border-box`;
    }


    circle.style.width = '150px';
    circle.style.height = '150px';
    setTimeout(() => {
        circle.style.width = '130px';
        circle.style.height = '130px';
    }, 200);
}
















