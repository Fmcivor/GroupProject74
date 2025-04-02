//INITIALISE
document.addEventListener('DOMContentLoaded', function() {
    currentState = upstairsHall;
    updateState();
    getSessionStorage();
})
UpdateInventory();



//GAME STATES
const upstairsHall = {
    "ID": 1,
    "room": "Upstairs Hall",
    "description": `You walk up the staircase and take alook around. 
    You see 3 doors and take a quick peek into each of them, seeing that they lead to a  living room, master bedroom and a guest bedroom`,
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
    // window.location.replace( '';
}

function goToMasterBedroom() {
    sessionStorage.setItem('currentRoom','masterBedroom.html');
    sessionStorage.setItem('currentState', 1);
    window.location.replace('masterBedroom.html');
}

function goToGuestBedroom() {
    //window.location.replace( '';
}

function goToDownStairs() {
    sessionStorage.setItem('currentRoom','downStairsHall.html');
    sessionStorage.setItem('currentState', 4);
    window.location.replace('downStairsHall.html');
}