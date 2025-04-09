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

function toggleLight() {
    if (!flashLightActive && currentState == darkAttic) {
        setResponse("You fumble in the dark, but without a working flashlight, you can't see anything.");
        return; 
    }
    if (currentState.ID === 1) {
        currentState = attic;
        sessionStorage.setItem("currentState", 2);
        atticLightingOn = true;
        flashLightActive = false;
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

    currentState = states.find(state => state.ID == currentStateID) || darkAttic



    updateState();
   
    
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
    sessionStorage.setItem('currentState', 1);
    window.location.replace('upstairsHall.html');
}

function goToHallAgain(){
    sessionStorage.setItem('currentState',2);
    window.location.replace('upstairsHall.html');
}

function searchBoxes() {

}

function pullDownCloth(){

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

            flashlight.style.background = `radial-gradient(circle at ${offsetX}px ${offsetY}px, rgba(0, 0, 0, 0.763) 120px, rgba(0, 0, 0, 0.99) 150px)`;

        }
    });