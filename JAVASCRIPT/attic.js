// Lead Developer MATTHEW CONNOLLY

let hasFlashLight = inventory.some(item => item.itemID == flashLightID);
let hasBatteries = inventory.some(item => item.itemID == batteriesID);
let atticLightingOn = JSON.parse(sessionStorage.getItem('atticLightingOn'));
let flashlight;
let flashLightActive = false;
let selectedItemID = null;




const darkAttic = {
    "ID": 1,
    "room": "Attic",
    "description": `${displayName}, you step into the attic, swallowed by complete darkness. The air is thick with dust, and the wooden floor creaks beneath your feet. Without a light, you can’t see a thing.`,
    "ImageHREF": "Images/darkAttic2.jpg",
    "interactions": [
        {
            "id": 0,
            "Text": "Search for a light source",
            "response": `You stupidly slam your toe against something solid. Tears stream down your face and 
                        you resist the urge to brutally kick the wall in frustration.`,
        },
        {
            "id": 1,
            "Text": "Leave attic",
            "response": goToHall
        },
    ]
}
// Handles toggling the light
function toggleLight() {
    // If flashlight isn't active and still in dark attic block light activation
    if (!flashLightActive && currentState == darkAttic) {
        setResponse("You fumble in the dark, but without a working flashlight, you can't see anything.");
        return; 

        //If in dark attic, transition to light attic
    }
    if (currentState.ID === 1) {
        currentState = attic;
        sessionStorage.setItem("currentState", 2);
        atticLightingOn = true;
        flashLightActive = false; // stop flashlight effect
        toggleFlashLight();
        updateState();


    } 
    sessionStorage.setItem("atticLightingOn",atticLightingOn);

    updateState();
    document.getElementById("lightSwitch").disabled = true;
}



document.addEventListener('DOMContentLoaded', function () {
    let states = [darkAttic, attic];
    let currentStateID = Number(sessionStorage.getItem('currentState'));

    currentState = states.find(state => state.ID == currentStateID) || darkAttic;

    updateState();
    hasAtticLetterClue = clueList.some(clue =>clue.clueID ==9);



    
   
    
});

 document.getElementById("lightSwitch").addEventListener("click", function () {
        toggleLight();
    });



const attic = {
    "ID": 2,
    "room": "Attic",
    "description": `The light flickers on, revealing a rather barren attic with only a 
                    few dusty boxes and a mysterious figure hidden under a cloth`,
    "ImageHREF": "Images/lightAttic.png",
    "interactions": [
        {
            "id": 0,
            "Text": "Search the boxes",
            "response": searchBoxes
        },

        {
            "id": 1,
            "Text": "Pull down the cloth",
            "response": pullDownCloth
        },


        {
            "id": 2,
            "Text": "Leave the attic",
            "response": goToHallAgain
        },



    ]
};

function goToHall() {
    goToNextRoom('upstairsHall.html',1);
}

function goToHallAgain(){
    goToNextRoom('upstairsHall.html',2);
}

async function searchBoxes() {
    if (hasAtticLetterClue) {
        setResponse("You have already searched the boxes and found all you could.");
    }else{
        hasAtticLetterClue = true;
        await addClue(9);
    setResponse("You rummage through the boxes revealing old newspapers, photos... and a wrinkled letter addressed to Charles. It reads, 'Charles you have left me with no choice you took everything from me. We were supposed to be partners. It's unsigned but the envelope is marked with a business logo: Donaghy and Kingston. Dated 27/01/2006")

}}

function pullDownCloth(){
    setResponse("You carefully lift the cloth to reveal a dusty mannequin and... dozens of tiny spiders scurry away. There is nothing else of interest. ")

}

function toggleFlashLight() {
    
        let flashlight = document.getElementById('atticFlashLight')
        
        if (flashLightActive) {
            flashlight.style.display = "block";
             document.querySelector('.rightColumn').style.backgroundImage = `url("Images/lightAttic.png")`;
        } else {
            flashlight.style.display = "none";  
            document.querySelector('.rightColumn').style.backgroundImage = `url("Images/darkAttic2.jpg")`;
        }

        
    }

    
    


    // setup flashlight movement based on mouse tracking
    flashlight = document.getElementById("atticFlashLight");

    rightColumn.addEventListener("mousemove", function (event) {
        if (flashLightActive) {
            const rect = rightColumn.getBoundingClientRect();
            const offsetX = event.clientX - rect.left;
            const offsetY = event.clientY - rect.top;

            // flashlight.style.display = "block";
            // flashlight.style.left = `${offsetX - 100}px`; // center 
            // flashlight.style.top = `${offsetY - 100}px`;

            let x = event.clientX - 50
            // creates radial gradient around the cursor
            flashlight.style.background = `radial-gradient(circle at ${offsetX}px ${offsetY}px, rgba(0, 0, 0, 0.763) 120px, rgba(0, 0, 0, 0.99) 150px)`;

        }
    });