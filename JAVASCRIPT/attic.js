let hasFlashLight = inventory.some(item => item.itemID == flashLightID);
let hasBatteries = inventory.some(item => item.itemID == batteriesID);
let atticLightingOn = JSON.parse(sessionStorage.getItem('atticLightingOn'));




const darkAttic = {
    "ID": 1,
    "room": "Attic",
    "description": `${displayName}, you step into the attic, swallowed by complete darkness. The air is thick with dust, and the wooden floor creaks beneath your feet. Without a light, you can’t see a thing.`,
    "ImageHREF": "Images/darkAttic.png",
    "interactions": [
        {
            "id": 0,
            "Text": "Search for light source",
            "response": `you stupidly slam your toe against something solid. Tears stream down your face and you resist the urge to brutally kick the wall in frustration.`,
        },
        {
            "id": 1,
            "Text": "Leave attic",
            "response": goToHall
        },
    ]
}

function toggleLight() {
    if (currentState.ID === 1) {
        currentState = attic;
        sessionStorage.setItem("currentState", 2);
        atticLightingOn = true;
        updateState();

    } else {
        currentState = darkAttic;
        atticLightingOn = false;
        sessionStorage.setItem("currentState", 1);
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
    document.getElementById("lightSwitch").addEventListener("click", function () {
        toggleLight();
    });
});



const attic = {
    "ID": 2,
    "room": "Attic",
    "description": `Well done ${displayName}, you have successfully found the light switch. Now continue your pursuit of the killer!`,
    "ImageHREF": "Images/lightAttic.png",
    "interactions": [
        {
            "id": 0,
            "Text": "Search the boxes",
            "response": searchBoxes
        },
        {
            "id": 1,
            "Text": "Leave the attic",
            "response": goToHall
        },



    ]
};

function goToHall() {
    sessionStorage.setItem('currentState', 1);
    window.location.replace('upstairsHall.html');
}

function searchBoxes() {

}