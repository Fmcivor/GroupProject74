// Page initialisation
document.addEventListener('DOMContentLoaded', function () {
    let states = [];
    states.push(guestBedroom);
    states.push(nightStandState); 

    let currentStateID = Number(sessionStorage.getItem('currentState')) || guestBedroom.ID;

    states.forEach(state => {
        if (state.ID === currentStateID) {
            currentState = state;
            return;
        }
    });

    updateState();
});


const guestBedroom = {
   
    "ID": 1,
    "room": "Guest Bedroom",
    "description": `${displayName}, you have now entered the guest bedroom. The bed is unmade and the room is filled with an eerie presence. You feel something was left behind.`,
    "ImageHREF": "Images/guestBedroomImg.jpg",
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
            "response": function () {
                setResponse("You decide to check under the bed in hopes of finding a golden ticket so you can forget about this job forever. You're a delusional optimist.");
            }
        }
    ]
};

// Define state for interacting with nightstand
const nightStandState = {
    "ID": 2,
    "room": "Guest Bedroom",
    "description": `You stand before the nightstand. Something catches your eye—an old letter and a nearly empty pill bottle.`,
    "interactions": [
        {
            "id": 0,
            "Text": "Read the letter",
            "response": function () {
                setResponse("A crumpled, half-burned letter filled with heated words. Charles' words accuse Margaret of something unforgivable.\n\n'…you always blamed me, but we both know the truth. You can’t keep running forever, Margaret.'");
            }
        },
        {
            "id": 1,
            "Text": "Examine the pill bottle",
            "response": function () {
                setResponse("A prescription bottle with Margaret’s name. The label warns of serious side effects, including dizziness, confusion, and—if taken in excess—respiratory failure. It’s nearly empty.");
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

// Function to handle checking the nightstand
function checkNightstand() {
    currentState = nightstandState;
    sessionStorage.setItem('currentState', nightStandState.ID);
    updateState();
}



// Function to update the UI when state changes
function updateState() {
    document.getElementById("room-description").innerText = currentState.description;
    const interactionContainer = document.getElementById("interaction-buttons");
    interactionContainer.innerHTML = ""; // Clear existing buttons

    currentState.interactions.forEach(option => {
        let button = document.createElement("button");
        button.innerText = option.Text;
        button.onclick = option.response;
        interactionContainer.appendChild(button);
    });
}

// Function to display response text
function setResponse(text) {
    document.getElementById("response-box").innerText = text;
}


