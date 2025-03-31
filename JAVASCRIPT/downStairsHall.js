
let lightingOn = JSON.parse(sessionStorage.getItem("lightingOn"));
let hasWeddingRingClue = clueList.some(clue =>clue.clueID ==3);


const downStairsHall ={
    "ID": 1,
    "room": "Down Stairs Hall",
    "description": `You have managed to gain access to the house now and finally you can do some proper investigating. Wait...${displayName}
    it's too dark to see anything. This is going to be difficult to find anything if we can't even see, except the faint outline of the room.`,
    "ImageHREF": "Images/lightsOffHall.jpg",
    "interactions": [
        {
            "id": 0,
            "Text": "Exit the house",
            "response": GoOutside
        },
        {
            "id": 1,
            "Text": "Trace the walls of the room",
            "response": traceHall
        },
        {
            "id":2,
            "Text": "explore the room blindly",
            "response": exploreHall
        }
    ]
}

const hallWall = {
    "ID": 2,
    "room": "Down Stairs Hall",
    "description": `You felt your hand just brush over something on the wall, you slowly trace your hands back and you feel it again.
    After a closer look you recognise it to be a switch. `,
    "ImageHREF": "Images/lightsOffHall.jpg",
    "interactions": [
        {
            "id": 0,
            "Text": "Trace the wall to the door",
            "response": goToFrontOfHall
        },
        {
            "id": 1,
            "Text": "Try the switch",
            "response": trySwitch
        }
    ]
}

const downStairsHallLightsOn ={
    "ID": 3,
    "room": "Down Stairs Hall",
    "description": `You stand in the hall and you can see the mess of the room. 
    A cleaner would've been more useful than a detective like you ${displayName}
    Over to your right stands a few drawers along with papers on top of the cabinet with various
    other items scattered along the floor.`,
    "ImageHREF": "Images/lightsOnHall.jpg",
    "interactions": [
        {
            "id": 0,
            "Text": "Exit the house",
            "response": GoOutside
        },
        {
            "id": 1,
            "Text": "Search the drawers",
            "response": searchDrawers
        },
        {
            "id":2,
            "Text": "Go to the back of the hall",
            "response": goToBackOfHall
        },
        {
            "id":3,
            "Text": "Enter the living room",
            "response": goToLivingRoom
        }
    ]
}

const BackOfHall ={
    "ID": 4,
    "room": "Down Stairs Hall",
    "description": `You stand at the back of the hall and now see the mess of the house continues throughout. In front of you and to your left are 2 more
    doors while the your right is a staircase.${displayName} it's about time we start to delve further into this mystery 
    and I think that starts with a thorough sweep of the building.`,
    "ImageHREF": "Images/lightsOnHall.jpg",
    "interactions": [
        {
            "id": 0,
            "Text": "Enter the kitchen",
            "response": goToKitchen
        },
        {
            "id": 1,
            "Text": "Enter the study",
            "response": goToStudy
        },
        {
            "id":2,
            "Text": "Go up the stairs",
            "response": goUpstairs
        },
        {
            "id":3,
            "Text": "Go to the front of the hall",
            "response": goToFrontOfHall
        }
    ]
}


document.addEventListener('DOMContentLoaded', async function(){
    let states = [];
    states.push(downStairsHall,hallWall,downStairsHallLightsOn,BackOfHall);

    let currentStateID = Number(sessionStorage.getItem('currentState'));
    states.forEach(state =>{
        if (state.ID == currentStateID) {
            currentState = state;
            return;
        }
    });

    updateState();
});


function goToFrontOfHall(){
    if (lightingOn == false) {
        currentState = downStairsHall;
    }
    else{
        currentState = downStairsHallLightsOn;
    }

    updateState();
}

function traceHall(){
    currentState = hallWall;
    updateState();
}

function trySwitch(){
    if (electricityOn) {
        lightingOn = true;
        sessionStorage.setItem("lightingOn",JSON.stringify(lightingOn));
        currentState = downStairsHallLightsOn;
        updateState();
        setResponse("You have managed to turn the lights on maybe now you will finally be able to find some clues.");
    }
    else{
        setResponse("Well that didn't do anything, maybe and electrician would've got further than you.");
    }
}

function exploreHall(){
    setResponse(`${displayName.toUpperCase()}, you need to be more careful you can't just go around wandering aimlessly
            in the dark knocking things over.`);
}

async function searchDrawers(){
    if (hasWeddingRingClue) {
        setResponse("You have already searched the drawers and papers and found the wedding ring");
    }
    else{
        hasWeddingRingClue = true;
        await addClue(3);
        updateClueNotebook();
        setResponse("You have found an engagement ring on the table and Victor has no known past relationships. You take note of this in your notebook as a clue");

    }
}

function goToBackOfHall(){
    currentState = BackOfHall;
    updateState();
}

async function goToLivingRoom(){
    sessionStorage.setItem("currentState",1);
    sessionStorage.setItem("currentRoom","livingRoom.html");
    await saveGame();
    window.location.href = "livingRoom.html";
}

async function goToKitchen(){
    sessionStorage.setItem('currentState',1);
    sessionStorage.setItem('currentRoom','kitchen.html');
    await saveGame();
    window.location.href = 'kitchen.html';
}

async function goUpstairs(){
    sessionStorage.setItem('currentState',1);
    sessionStorage.setItem('currentRoom','upstairsHall.html');
    await saveGame();
    window.location.href = 'upstairsHall.html';
}

async function goToStudy(){
    sessionStorage.setItem('currentState',1);
    sessionStorage.setItem('currentRoom','study.html');
    await saveGame();
    window.location.href = 'study.html';
}

async function GoOutside(){
    sessionStorage.setItem("currentState",1);
    sessionStorage.setItem('currentRoom','OutsideHouse.html');
    await saveGame();
    window.location.href = 'OutsideHouse.html';
}


