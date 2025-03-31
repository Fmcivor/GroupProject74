document.addEventListener('DOMContentLoaded', function () {
    let states = [guestBedroom, nightStandState, wardrobeState, underBedState];
    let currentStateID = Number(sessionStorage.getItem('currentState'));
    
    // Find the matching state or default to guestBedroom
    currentState = states.find(state => state.ID === currentStateID) || guestBedroom;
    
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
        }
    ]
};

const nightStandState = {
    "ID": 2,
    "room": "Guest Bedroom",
    "description": `You stand before the nightstand. A half-burned letter peeks out from the drawer, alongside a nearly empty pill bottle with a smudged fingerprint.`,
    "interactions": [
        {
            "id": 0,
            "Text": "Read the letter",
            "response": readLetter
        },
        {
            "id": 1,
            "Text": "Examine the pill bottle",
            "response": examinePillBottle
        },
        {
            "id": 2,
            "Text": "Go back",
            "response": function(){
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
    "description": `The wardrobe doors creak open, revealing a collection of outdated dresses and suits. The scent of faded perfume clings to the fabric. A torn piece of cloth is snagged at the back—was something hidden here?`,
    "interactions": [
        {
            "id": 0,
            "Text": "Take the torn fabric",
            "response": function(){
                setResponse("You pocket the torn fabric. Could it belong to Charles’ missing coat?");
            }
        },
        {
            "id": 1,
            "Text": "Go back",
            "response": function(){
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
    "description": `You kneel down and peer under the bed. A faded journal page lies crumpled in the dust, its ink smeared as if someone tried to destroy it.`,
    "interactions": [
        {
            "id": 0,
            "Text": "Read the journal page",
            "response": function(){
                setResponse("The journal entry reads: 'Margaret, you'll never get away with this. The truth is already unraveling. I was a fool to trust you.' The ink is smudged, but the message is clear—Charles feared something.");
            }
        },
        {
            "id": 1,
            "Text": "Go back",
            "response": function(){
                currentState = guestBedroom;
                sessionStorage.setItem('currentState', guestBedroom.ID);
                updateState();
            }
        }
    ]
};

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

function readLetter(){
    setResponse("A crumpled, half-burned letter filled with heated words. Charles’ words accuse Margaret of something unforgivable. But what?");
}

async function examinePillBottle(){
    let button = document.getElementById(responseId);
    button.style.color = 'rgb(153, 153, 153)';
    button.querySelector('i').style.color = 'rgb(153,153,153)';

    if(hasPillBottle) {
        setResponse("You've already taken the pill bottle. There's nothing here now.");

    } else {
        setResponse("You examine the nearly empty pill bottle. The label is partially torn, but you can still read:\n\n'including dizziness, confusion, and—if taken in excess—respiratory failure.'\n\nDo you want to take it?");
        addItem(pillBottleID);
        hasPillBottle = true;
    }
}
