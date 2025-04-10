
let lightingOn = JSON.parse(sessionStorage.getItem("lightingOn"));
let hasWeddingRingClue;


const downStairsHall ={
    "ID": 1,
    "room": "Down Stairs Hall",
    "description": `You have managed to gain access to the house, and now and finally you can do some proper investigating. Wait...${displayName}
    it's too dark to see anything. This is going to be difficult to find anything if we can't even see, except for the faint outline of the room.`,
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
            "Text": "Explore the room blindly",
            "response": exploreHall
        }
    ]
}

const hallWall = {
    "ID": 2,
    "room": "Down Stairs Hall",
    "description": `You felt your hand just brush over something on the wall. You slowly trace your hands back and you feel it again.
    After a closer look, you recognise it as a switch. `,
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
    "description": `You stand in the hall and take in the mess of the room. 
    A cleaner would've been more useful than a detective like you, ${displayName}.
    Over to your right stands a few drawers along with papers on top of the cabinet, and various
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
    "description": `You stand at the back of the hall and see that the mess of the house continues throughout. In front of you and to your left are two more
    doors while to your right is a staircase.${displayName}, it's about time we start delving further into this mystery, 
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
    currentState = states.find(state => state.ID == currentStateID) || downStairsHall;

    updateState();
    hasWeddingRingClue = clueList.some(clue =>clue.clueID ==3);
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
        setDescriptionAndResponse("You have managed to turn the lights on, maybe now you will finally be able to find some clues.");
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
        if (inventory.filter(item => item.itemUsed == false).length == 6) {
            setResponse("You must drop an item before you can pick up the ring. HINT try using an item to get rid of it.");
        }
        else{
            hasWeddingRingClue = true;
            await addItem(ringID);
            await addClue(3);
            setResponse("You have found a wedding ring, but why was it lying here in the drawer? It looks like the relationship between the Margaret and Charles was not as perfect as it seemed.");
            
        }
    }
}

function goToBackOfHall(){
    currentState = BackOfHall;
    updateState();
}

async function goToLivingRoom(){
    goToNextRoom('livingRoom.html',1);
}

async function goToKitchen(){
    goToNextRoom('kitchen.html',1);
}

async function goUpstairs(){
    goToNextRoom('upstairsHall.html',1);
}

async function goToStudy(){
    goToNextRoom('study.html',1);
}

async function GoOutside(){
    goToNextRoom('OutsideHouse.html',1);
}


