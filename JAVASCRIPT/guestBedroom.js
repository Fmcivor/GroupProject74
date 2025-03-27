

document.addEventListener('DOMContentLoaded', function () {
    let states = [guestBedroom, nightStandState];
    let currentStateID = Number(sessionStorage.getItem('currentState'));
    
    // Find the matching state or default to guestBedroom
    currentState = states.find(state => state.ID === currentStateID) || guestBedroom;
    
    updateState();
});

const guestBedroom = {
    "ID": 1,
    "room": "Guest Bedroom",
    "description": `${displayName}, you have now entered the guest bedroom. The bed is unmade and the room is filled with an eerie presence. You sense something was left behind. `,
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
            "response": function () {
                setResponse("You decide to check under the bed in hopes of finding a golden ticket so you can forget about this job forever. You're a delusional optimist.");
            }
        }
    ]
};

const nightStandState = {
    "ID": 2,
    "room": "Guest Bedroom",
    "description": `You stand before the nightstand. Something catches your eye—an old letter and a nearly empty pill bottle.`,
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


function checkNightstand() {
    currentState = nightStandState; 
    sessionStorage.setItem('currentState', nightStandState.ID);
    updateState();
}

function examineWardrobe() {
    setResponse("You open the wardrobe, revealing old clothes and a lingering scent of perfume. Nothing unusual, but a faint scratch mark is visible at the back.");
}
function readLetter(){
    setResponse("A crumpled, half-burned letter filled with heated words. Charles' words accuse Margaret of something unforgivable.\n\n");
}
function examinePillBottle(){
    setResponse("You examine a prescription bottle with the label half ripped. What's left of it reads 'including dizziness, confusion, and—if taken in excess—respiratory failure'. It’s nearly empty. You see this as crucial evidence in your investigation and so pick up the pill bottle to present as evidence.");

}


