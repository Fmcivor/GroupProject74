

const guestBedroom = {
    "ID":1,
    "room": "Guest Bedroom",
    "description": `${displayName}, you have now entered the guest bedroom. the bed is unmade and the room filled with an eery presence. You feel something was left behind.`,
    "ImageHREF": "Images/guestBedroomImg.jpg",
    "interactions": [
        {
            "id": 0,
            "Text": "Check under the mat",
            "response": checkNightstand
        },
        {
            "id": 1,
            "Text": "Follow the path to your left",
            "response": "test1"
        },
        {
            "id": 2,
            "Text": "Enter house",
            "response": "You can't enter the house with the door being locked"
        }
    ]
}


document.addEventListener('DOMContentLoaded', function () {
    let states = [];
    states.push(guestBedroom);

    let currentStateID = Number(sessionStorage.getItem('currentState'));
    states.forEach(state => {
        if (state.ID == currentStateID) {
            
            currentState = state;
            
            return;
        }
    });
    
    updateState();
});



async function getSessionStorage(){
    const responseParagraph = document.getElementById("responseParagraph");
    const clueList = document.getElementById("clueList");
}


function checkNightstand() {
    document.getElementById("responseParagraph").innerHTML = `
        <p>You open the nightstand. Inside, you find a pill bottle and a heated letter.</p>
        <button onclick="readLetter()">Read Heated Letter</button>
        <button onclick="examinePillBottle()">Examine Pill Bottle</button>
    `;
}

function readLetter() {
    document.getElementById("responseParagraph").innerHTML += `
        <p>The letter is from Margaret to Charles, full of frustration. It suggests she wanted to leave him.</p>
    `;
    addClue("Margaret's Heated Letter");
}

function examinePillBottle() {
    document.getElementById("responseParagraph").innerHTML += `
        <p>The bottle details warnings of aggression and confusion. Any other information on the bottle seems to be unreadable. </p>
    `;
    addClue("Medication with Side Effects");
}

function examineWardrobe() {
    document.getElementById("responseParagraph").innerHTML = `
        <p>You find a half-zipped suitcase with a train ticket dated a day before Charles' death.</p>
    `;
    addClue("Margaret's Packed Suitcase");
}

function checkUnderBed() {
    document.getElementById("responseParagraph").innerHTML = `
        <p>You look underneath the bed hoping to find a golden ticket so you can forget about why you chose this job. You find nothing. Keep dreaming. </p>
    `;
}

function addClue(clue) {
    const clueItem = document.createElement("li");
    clueItem.textContent = clue;
    document.getElementById("clueList").appendChild(clueItem);
}
