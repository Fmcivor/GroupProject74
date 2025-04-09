//CONSTANTS
const dial1 = document.getElementById('dial1');
const dial2 = document.getElementById('dial2');
const dial3 = document.getElementById('dial3');
const dial4 = document.getElementById('dial4');
const dialCenter = document.getElementById('dialCenter');

const dial1SVG = document.getElementById('d1SVG');
const dial2SVG = document.getElementById('d2SVG');
const dial3SVG = document.getElementById('d3SVG');
const dial4SVG = document.getElementById('d4SVG');

const dial1Display = document.getElementById('d1Display');
const dial2Display = document.getElementById('d2Display');
const dial3Display = document.getElementById('d3Display');
const dial4Display = document.getElementById('d4Display');

const openButton = document.getElementById('safeHandleButton');
const evidenceButton = document.getElementById('safeEvidenceButton');
const safeFront = document.getElementById('safeFront');
const codeContainer = document.getElementById('codeContainer');
const safeCode = '4379';

const safeGameContainer = document.getElementById('safeGameContainer')

//VARIABLES
let hasLockpick;
let hasKnife;

let d1Rotating = false;
let d2Rotating = false;
let d3Rotating = false;
let d4Rotating = false;

let d1Angle = 0;
let d2Angle = 0;
let d3Angle = 0;
let d4Angle = 0;

let d1TargetAngle = 0;
let d2TargetAngle = 0;
let d3TargetAngle = 0;
let d4TargetAngle = 0;

let d1Value = 3;
let d2Value = 0;
let d3Value = 0;
let d4Value = 0;

let selectedDial = 1;


//DIAL ROTATION FUNCTIONS
function keyDownEventHandler(event) {
    switch (event.key) {
        case "ArrowLeft":
            rotateRight();
            rotateRight();
            break;
        case "ArrowRight":
            rotateLeft();
            rotateLeft();
            break;
        case "ArrowUp":
            if(selectedDial > 1) {
                selectedDial--;
                higlightSelectedDial();
                higlightSelectedDial();
            }
            break;
        case "ArrowDown":
            if(selectedDial < 4) {
                selectedDial++;
                higlightSelectedDial();
                higlightSelectedDial();
            }
            break;
    }
}

function rotateLeft() {
    const interval = 10;

    switch (selectedDial) {
        case 1:
            if(!d1Rotating) {
                d1RotateLeft(interval);
                dial1Display.innerText = d1Value;
            }
            break;
        case 2:
            if(!d2Rotating) {
                d2RotateLeft(interval);
                dial2Display.innerText = d2Value;
            }
            break;
        case 3:
            if(!d3Rotating) {
                d3RotateLeft(interval);
                dial3Display.innerText = d3Value;
            }
            break;
        case 4:
            if(!d4Rotating) {
                d4RotateLeft(interval);
                dial4Display.innerText = d4Value;
            }
            break;
    }     
}

function d1RotateLeft(interval) {
    d1Rotating = true;
    d1TargetAngle += 36;
    d1Value --;
    if (d1Value === -1) {
        d1Value = 9;
    }

    const intervalId = setInterval(() => {
        d1Angle++;
        dial1SVG.style.transform = `rotate(${d1Angle}deg)`;
        
        if (d1Angle >= d1TargetAngle) {
            clearInterval(intervalId);
            d1Rotating = false;
        }
    }, interval);
}

function d2RotateLeft(interval) {
    d2Rotating = true;
    d2TargetAngle += 36;
    d2Value --;
    if (d2Value === -1) {
        d2Value = 9;
    }

    const intervalId = setInterval(() => {
        d2Angle++;
        dial2SVG.style.transform = `rotate(${d2Angle}deg)`;
        
        if (d2Angle >= d2TargetAngle) {
            clearInterval(intervalId);
            d2Rotating = false;
        }
    }, interval);
}

function d3RotateLeft(interval) {
    d3Rotating = true;
    d3TargetAngle += 36;
    d3Value --;
    if (d3Value === -1) {
        d3Value = 9;
    }

    const intervalId = setInterval(() => {
        d3Angle++;
        dial3SVG.style.transform = `rotate(${d3Angle}deg)`;

        if (d3Angle >= d3TargetAngle) {
            clearInterval(intervalId);
            d3Rotating = false;
        }
    }, interval);
}

function d4RotateLeft(interval) {
    d4Rotating = true;
    d4TargetAngle += 36;
    d4Value --;
    if (d4Value === -1) {
        d4Value = 9;
    }

    const intervalId = setInterval(() => {
        d4Angle++;
        dial4SVG.style.transform = `rotate(${d4Angle}deg)`;
        
        if (d4Angle >= d4TargetAngle) {
            clearInterval(intervalId);
            d4Rotating = false;
        }
    }, interval);
}


function rotateRight() {
    const interval = 10;
    
    switch(selectedDial) {
        case 1:
            if(!d1Rotating) {
                d1RotateRight(interval);
                dial1Display.innerText = d1Value;
            }
            break;
        case 2:
            if(!d2Rotating) {
                d2RotateRight(interval);
                dial2Display.innerText = d2Value;
            }
            break;
        case 3:
            if(!d3Rotating) {
                d3RotateRight(interval);
                dial3Display.innerText = d3Value;
            }
            break;
        case 4:
            if(!d4Rotating) {
                d4RotateRight(interval);
                dial4Display.innerText = d4Value;
            }
            break;
    }
}

function d1RotateRight(interval) {
    d1TargetAngle -= 36;
    d1Value ++;
    if (d1Value === 10) {
        d1Value = 0;
    }

    d1Rotating = true; // Disable button while interval is active

    const intervalId = setInterval(() => {
        d1Angle--;
        dial1SVG.style.transform = `rotate(${d1Angle}deg)`;
        
        if (d1Angle <= d1TargetAngle) {
            clearInterval(intervalId);
            d1Rotating = false; // Re-enable button after rotation
        }
    }, interval);
}

function d2RotateRight(interval) {
    d2TargetAngle -= 36;
    d2Value ++;
    if (d2Value === 10) {
        d2Value = 0;
    }

    d2Rotating = true; // Disable button while interval is active

    const intervalId = setInterval(() => {
        d2Angle--;
        dial2SVG.style.transform = `rotate(${d2Angle}deg)`;
        
        if (d2Angle <= d2TargetAngle) {
            clearInterval(intervalId);
            d2Rotating = false; // Re-enable button after rotation
        }
    }, interval);
}

function d3RotateRight(interval) {
    d3TargetAngle -= 36;
    d3Value ++;
    if (d3Value === 10) {
        d3Value = 0;
    }

    d3Rotating = true; // Disable button while interval is active

    const intervalId = setInterval(() => {
        d3Angle--;
        dial3SVG.style.transform = `rotate(${d3Angle}deg)`;
        
        if (d3Angle <= d3TargetAngle) {
            clearInterval(intervalId);
            d3Rotating = false; // Re-enable button after rotation
        }
    }, interval);
}

function d4RotateRight(interval) {
    d4TargetAngle -= 36;
    d4Value ++;
    if (d4Value === 10) {
        d4Value = 0;
    }

    d4Rotating = true; // Disable button while interval is active

    const intervalId = setInterval(() => {
        d4Angle--;
        dial4SVG.style.transform = `rotate(${d4Angle}deg)`;
        
        if (d4Angle <= d4TargetAngle) {
            clearInterval(intervalId);
            d4Rotating = false; // Re-enable button after rotation
        }
    }, interval);
}


//INITIALISE
document.addEventListener('DOMContentLoaded', function() {
    let states = [];

    states.push(enteredMasterBedroom, openingSafe);

    let currentStateID = Number(sessionStorage.getItem('currentState'));
    currentState = states.find(state => state.ID == currentStateID) || enteredMasterBedroom;
    updateState();
    randomiseDials();

    hasLockpick = inventory.some(item => item.itemID == lockpickID);
    hasKnife = inventory.some(item => item.itemID == knifeItemID);
})

openButton.addEventListener('click', openSafeHandler)

function openSafeHandler() {
    if(d1Value == safeCode[0] && d2Value == safeCode[1] && d3Value == safeCode[2] && d4Value == safeCode[3]) {
        //open safe
        openButton.style.animation = 'turnHandleUnlocked 4s ease-in';
        dial1Display.style.color = "green";
        dial2Display.style.color = "green";
        dial3Display.style.color = "green";
        dial4Display.style.color = "green";
        safeFront.classList.add('openedSafeFront');
        window.removeEventListener("keydown", keyDownEventHandler);
        openButton.removeEventListener("click", openSafeHandler);
        dial1.style.border = "3px solid black";
        dial2.style.border = "3px solid black";
        dial3.style.border = "3px solid black";
        dial4.style.border = "3px solid black";
        dialCenter.style.border = "3px solid black";
        evidenceButton.addEventListener("click", addKnifeEvidence);
        setTimeout(function() {
            openButton.style.animation = 'none';
        }, 1000);
    }
    else {
        //wrong code
        openButton.style.animation = 'turnHandleLocked 1s ';
        dial1Display.style.animation = 'incorrectNumbers 1s';
        dial2Display.style.animation = 'incorrectNumbers 1s';
        dial3Display.style.animation = 'incorrectNumbers 1s';
        dial4Display.style.animation = 'incorrectNumbers 1s';
        setTimeout(function() {
            openButton.style.animation = 'none';
            dial1Display.style.animation = 'none';
            dial2Display.style.animation = 'none';
            dial3Display.style.animation = 'none';
            dial4Display.style.animation = 'none';
        }, 1000);
    }
}

async function addKnifeEvidence() {
    if (hasKnife) {
        setResponse("You have already taken the knife out of the safe")
        return;
    }
    else{
        if (inventory.filter(item => item.itemUsed == false).length == 6) {
            setResponse("You must drop an item before you can pick up the knife. HINT try using an item to get rid of it.");
        }
        else {

            hasKnife = true;
            await addItem(knifeItemID);
            await addClue(knifeClueID);
            setResponse(`You take the knife out of the safe and feel proud of yourself, 
                with this piece of evidence you are surely one step closer to catching the killer`);
            evidenceButton.removeEventListener("click", addKnifeEvidence);
            evidenceButton.style.display = 'none';
        }
    }
    
    
    
}



//GAME STATES

const enteredMasterBedroom = {
    "ID":1,
    "room": "Master Bedroom",
    "description": `You have entered the master bedroom, in the center of the room you see a large bed with red accents on a rich red rug.  
                    A safe stands beside a dresser with a clock and plant.  
                    The bedside table holds a lamp and décor, while framed paintings add a classic touch.`,
    "ImageHREF": "IMAGES/masterBedroom.jpg",
    "interactions": [
        {
            "id": 0,
            "Text": "Investigate the safe",
            "response": investigateSafe
        },
        {
            "id": 1,
            "Text": "Admire the art",
            "response": `You marvel at the beautiful art. Unfortunately ${displayName} I don't think it'll help you solve the case`
        },
        {
            "id": 2,
            "Text": "Look in the bedside table",
            "response": searchBedsideTable
        },
        {
            "id": 3,
            "Text": "Go back to the hall",
            "response": goToHall
        }
    ]
}

const openingSafe = {
    "ID": 2,
    "room": "Master Bedroom",
    "description": `You decide to try to open the safe but don't know the code.\n
                    perhaps you can find it somewhere in the house`,
    "ImageHREF": "IMAGES/masterBedroom.jpg",
    "interactions": [
        {
            "id": 0,
            "Text": "Stop investigating the safe",
            "response": hideSafe
        },
    ]
}


//STATE FUNCTIONS
function goToHall() {
    goToNextRoom('upstairsHall.html', 1);
}

function hideSafe() {
    safeGameContainer.style.display = 'none';  
    codeContainer.style.display = 'none';
    window.removeEventListener("keydown", keyDownEventHandler);
    currentState = enteredMasterBedroom;
    updateState();
}

async function searchBedsideTable() {
    if(hasLockpick){
        setResponse("You double check the bedside table, but theres nothing of interest left")
    }
    else {
        if (inventory.filter(item => item.itemUsed == false).length == 6) {
            setResponse("You must drop an item before you can pick up the lockpick. HINT try using an item to get rid of it.");
        }
        else {
            hasLockpick = true;
            await addItem(lockpickID);
            setResponse("You look inside the bedside table and find a lockpick! You decide to take it with you as you're sure it'll come in handy");
        }
    }
}

function investigateSafe() {
    if(!hasKnife) {
        currentState = openingSafe;
        updateState();
        setDescriptionAndResponse(`
                    Guide:\n
                    Use the left and right arrows to rotate the dials\n
                    Use the up and down arrows to change between dials\n
                    Click on the handle to attempt to open the safe
                    `);
        displaySafe();
    }
    else {
        setResponse("You have already investigated the safe")
    }
    
}

function displaySafe() {
    safeGameContainer.style.display = 'flex';  
    window.addEventListener("keydown", keyDownEventHandler);
}

function higlightSelectedDial() {
    dial1.style.border = "3px solid black";
    dial2.style.border = "3px solid black";
    dial3.style.border = "3px solid black";
    dial4.style.border = "3px solid black";
    dialCenter.style.border = "3px solid black";

    dial1Display.style.color = "black";
    dial2Display.style.color = "black";
    dial3Display.style.color = "black";
    dial4Display.style.color = "black";

    switch(selectedDial) {
        case 1:
            dial1.style.border = "3px solid rgb(252, 215, 7)";         
            dial2.style.border = "3px solid rgb(252, 215, 7)";   
            dial1Display.style.color = "rgb(252, 215, 7)";
            break;
        case 2:
            dial2.style.border = "3px solid rgb(252, 215, 7)";         
            dial3.style.border = "3px solid rgb(252, 215, 7)"; 
            dial2Display.style.color = "rgb(252, 215, 7)";
            break;
        case 3:
            dial3.style.border = "3px solid rgb(252, 215, 7)";         
            dial4.style.border = "3px solid rgb(252, 215, 7)"; 
            dial3Display.style.color = "rgb(252, 215, 7)";
            break;
        case 4:
            dial4.style.border = "3px solid rgb(252, 215, 7)";         
            dialCenter.style.border = "3px solid rgb(252, 215, 7)"; 
            dial4Display.style.color = "rgb(252, 215, 7)";
            break;
    }
}



document.getElementById('useItemBtn').addEventListener('click', itemUsedHandler);

function itemUsedHandler() {
    if (selectedItemID != null) {
        if (currentState == openingSafe && selectedItemID == safeCodeID) {
            codeContainer.style.display = 'flex';
        }
        else {
            setResponse("That didn't do anything, maybe try something else.");
        }
    }
    else {

        setResponse("You must select an item before you can use it");
    }
}

function randomiseDials() {
    d1Value = Math.floor(Math.random() * 10);
    d2Value = Math.floor(Math.random() * 10);
    d3Value = Math.floor(Math.random() * 10);
    d4Value = Math.floor(Math.random() * 10);

    dial1Display.innerText = d1Value;
    dial2Display.innerText = d2Value;
    dial3Display.innerText = d3Value;
    dial4Display.innerText = d4Value;

    d1Angle = d1Value * -36;
    d2Angle = d2Value * -36;
    d3Angle = d3Value * -36;
    d4Angle = d4Value * -36;

    d1TargetAngle = d1Angle;
    d2TargetAngle = d2Angle;
    d3TargetAngle = d3Angle;
    d4TargetAngle = d4Angle;

    dial1SVG.style.transform = `rotate( ${d1Angle}deg)`;
    dial2SVG.style.transform = `rotate( ${d2Angle}deg)`;
    dial3SVG.style.transform = `rotate( ${d3Angle}deg`;
    dial4SVG.style.transform = `rotate( ${d4Angle}deg`;
}