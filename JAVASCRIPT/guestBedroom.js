let hasPillBottle;
let hasGlassClue;
let hasFlashLight;

document.addEventListener('DOMContentLoaded', function () {
    let states = [guestBedroom, nightStandState, wardrobeState, underBedState];
    let currentStateID = Number(sessionStorage.getItem('currentState'));

    // Find the matching state or default to guestBedroom
    currentState = states.find(state => state.ID == currentStateID) || guestBedroom;

    hasPillBottle = inventory.some(item => item.itemID == pillBottleID);
    hasGlassClue = clueList.some(clue => clue.clueID == 6);
    hasFlashLight = inventory.some(item => item.itemID == flashLightID);
    updateState();
});

const guestBedroom = {
    "ID": 1,
    "room": "Guest Bedroom",
    "description": `${displayName}, you have now entered the guest bedroom. The bed is unmade, and the stale scent of perfume lingers in the air, mixing with something sharp... metallic. A faint indent in the carpet catches your eye. Something was left behind here.`,
    "ImageHREF": "Images/guestBedroomFinal.jpg",
    "interactions": [
        {
            "id": 0,
            "Text": "Check nightstand",
            "response": checkNightstand
        },
        {
            "id": 1,
            "Text": "Examine wardrobe",
            "response": examineWardrobe
        },
        {
            "id": 2,
            "Text": "Check under bed",
            "response": checkUnderBed
        },
        {
            "id": 3,
            "Text": "Leave the guest bedroom",
            "response": goToHall
        }
    ]
};

const nightStandState = {
    "ID": 2,
    "room": "Guest Bedroom",
    "description": `You stand before the nightstand with a half opened drawer, alongside a nearly empty pill bottle with a smudged fingerprint.`,
    "ImageHREF": "Images/nightstand.jpg",
    "interactions": [
        {
            "id": 0,
            "Text": "Open the drawer",
            "response": openDrawer
        },
        {
            "id": 1,
            "Text": "Examine the pill bottle",
            "response": examinePillBottle
        },
        {
            "id": 2,
            "Text": "Go back",
            "response": function () {
                currentState = guestBedroom;
                sessionStorage.setItem('currentState', guestBedroom.ID);
                updateState();
            }
        }
    ]
};

const wardrobeState = {
    "ID": 3,
    "room": "Guest Bedroom",
    "description": `The wardrobe doors creak open, revealing a collection of outdated dresses and suits along with a suitcase. The scent of faded perfume clings to the fabric.`,
    "ImageHREF": "Images/wardrobe.jpg",
    "interactions": [
        {
            "id": 0,
            "Text": "Rummage through the suits",
            "response": function () {
                setResponse("You don't find anything of use in the suits.");
            }
        },

        {
            "id": 1,
            "Text": "Open the suitcase",
            "response": function () {
                setResponse("You find a receipt of a train ticket belonging to Margaret dated a day after Charles death. Why would she plan to leave so soon after?")
            }



        },
        {
            "id": 2,
            "Text": "Go back",
            "response": function () {
                currentState = guestBedroom;
                sessionStorage.setItem('currentState', guestBedroom.ID);
                updateState();
            }
        }
    ]
};

const underBedState = {
    "ID": 4,
    "room": "Guest Bedroom",
    "description": `You kneel down under the bed but cannot see anything instantly.`,
    "ImageHREF": "Images/guestBedroomFinal.jpg",
    "interactions": [
        {
            "id": 0,
            "Text": "Move your hand around",
            "response": moveHandAround


        },
        {
            "id": 1,
            "Text": "Go back",
            "response": function () {
                currentState = guestBedroom;
                sessionStorage.setItem('currentState', guestBedroom.ID);
                updateState();
            }
        }
    ]
};

const pillBottleChoiceState = {
    "ID": 5,
    "room": "GuestBedroom",
    "ImageHREF": "Images/nightstand.jpg",
    "description": "You examine the nearly empty pill bottle. The label is partially torn, but you can still read:\n\n" +
        "'including dizziness, confusion, and—if taken in excess—respiratory failure.'\n\n" + "This may be useful to take.",
    "interactions": [
        {
            "id": 0,
            "Text": "Take the pill bottle",
            "response": takePillBottle
        },
        {
            "id": 1,
            "Text": "Leave the pill bottle",
            "response": leavePillBottle
        },
        {
            "id": 2,
            "Text": "Go back",
            "response": function () {
                currentState = guestBedroom;
                sessionStorage.setItem('currentState', guestBedroom.ID);
                updateState();
            }
        }
    ]
}


document.addEventListener('DOMContentLoaded', function () {
    let states = [guestBedroom, nightStandState, wardrobeState, underBedState];
    let currentStateID = Number(sessionStorage.getItem('currentState'));

    // Find the matching state or default to guestBedroom
    currentState = states.find(state => state.ID === currentStateID) || guestBedroom;

    updateState();
});


function checkNightstand() {
    currentState = nightStandState;
    sessionStorage.setItem('currentState', nightStandState.ID);
    updateState();
}

function examineWardrobe() {
    currentState = wardrobeState;
    sessionStorage.setItem('currentState', wardrobeState.ID);
    updateState();
}

function checkUnderBed() {
    currentState = underBedState;
    sessionStorage.setItem('currentState', underBedState.ID);
    updateState();
}

function goToHall() {
    goToNextRoom('upstairsHall.html', 1);
}

async function openDrawer() {
    if (hasGlassClue) {
        setResponse("You have already searched the drawer and taken note of the missing shard");
    } else {
        hasGlassClue = true;
        await addClue(6);
        updateClueNotebook();
        setResponse("Your eyes are drawn to a photoframe. The frame sadly lies in disarray, its glass shattered around it. A photo of Charles and Margaret once happy is still partially visible. You notice that the shards look sparce and so piece together what is left to see that there is a gap in the form of a large, pointed piece of glass. Surely not?");
    }
}

async function moveHandAround() {
    let button = document.getElementById(responseId);
    button.style.color = 'rgb(153, 153, 153)';
    button.querySelector('i').style.color = 'rgb(153, 153, 153)';

    if (hasFlashLight) {
        setResponse("There is nothing under here the flashlight has already been taken");
    }
    else {
        if (inventory.filter(item => item.itemUsed == false).length == 6) {
            setResponse("You must drop an item before you can pick up the flashlight. HINT try using an item to get rid of it.");
        }
        else {
            hasFlashLight = true;
            await addItem(flashLightID);
            setResponse("Your hand brushes past an object which you lift. It's a flash light which you decide to add to your inventory. This could come in handy...");
        }
        
    }
}



async function examinePillBottle() {

    let button = document.getElementById(responseId);
    button.style.color = 'rgb(153, 153, 153)';
    button.querySelector('i').style.color = 'rgb(153,153,153)';

    if (hasPillBottle) {
        setResponse("You've already taken the pill bottle. There's nothing here now.");
    } else {
        currentState = pillBottleChoiceState;
        updateState();
        setResponse("You examine the nearly empty pill bottle. The label is partially torn, but you can still read:\n\n" +
            "'including dizziness, confusion, and—if taken in excess—respiratory failure.'\n\n" + "This may be useful to take"


        );
    }
}

async function takePillBottle() {
    if (!hasPillBottle) {
        if (inventory.filter(item => item.itemUsed == false).length == 6) {
            setResponse("You must drop an item before you can pick up the flashlight. HINT try using an item to get rid of it.");
        }
        else {
            hasPillBottle = true;
            await addItem(pillBottleID);
            setResponse("You take the pill bottle and add it to your inventory.");
        }
        
    } else {
        setResponse("You already have the pill bottle in your inventory.");
    }

}

function leavePillBottle() {
    setResponse("You decide to leave the pill bottle where it is. Maybe it's best not to touch it.");
}
