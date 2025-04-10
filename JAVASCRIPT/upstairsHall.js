//DEVELOPER: CALLUM

//INITIALISE
document.addEventListener('DOMContentLoaded', function() {
    currentState = upstairsHall;
    updateState();
})
UpdateInventory();

let atticLightingOn = JSON.parse(sessionStorage.getItem('atticLightingOn'));



//GAME STATES
const upstairsHall = {
    "ID": 1,
    "room": "Upstairs Hall",
    "description": `You walk up the staircase and take a look around. 
    You see 3 doors and take a quick peek into each of them, seeing that they lead to an attic, master bedroom and a guest bedroom`,
    "ImageHREF": "Images/upstairsHall.jpg",
    "interactions": [
        {
            "id": 0,
            "Text": "Head into the attic",
            "response": goToAttic
        },
        {
            "id": 1,
            "Text": "Enter the master bedroom",
            "response": goToMasterBedroom
        },
        {
            "id": 2,
            "Text": "Enter the guest bedroom",
            "response": goToGuestBedroom
        },
        {
            "id": 3,
            "Text": "Go back downstairs",
            "response": goToDownStairs
        }
    ]
}


//STATE FUNCTIONS
function goToAttic() {
    if (atticLightingOn) {
        goToNextRoom('attic.html',2);
    }
    else{
        goToNextRoom('attic.html',1);
    }
    
}

function goToMasterBedroom() {
    goToNextRoom('masterBedroom.html',1);
}

function goToGuestBedroom() {
    goToNextRoom('guestBedroom.html',1);
}

function goToDownStairs() {
    
    goToNextRoom('downStairsHall.html',4);
}