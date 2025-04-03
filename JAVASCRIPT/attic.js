let hasFlashLight = inventory.some(item=>item.itemID == flashLightID);
let hasBatteries = inventory.some(item=>item.itemID == batteriesID);





const darkAttic = {
    "ID": 1,
    "room": "Attic",
    "description": `${displayName}, you step into the attic, swallowed by complete darkness. The air is thick with dust, and the wooden floor creaks beneath your feet. Without a light, you can’t see a thing. `,
    "ImageHREF": "Images/guestBedroomFinal.jpg",
    "interactions": [
        {
            "id": 0,
            "Text": "Search for light source",
            "response": `you stupidly slam your toe against something solid. Tears stream down your face and you resist the urge to brutally kick the wall in frustration. `,
        },
        {
            "id": 1,
            "Text": "Leave attic",
            "response": goToHall
        },
    ]
};

document.addEventListener('DOMContentLoaded', function () {
    let states = [darkAttic, attic];
    let currentStateID = Number(sessionStorage.getItem('currentState'));

    // currentState = states.find(state => state.ID === currentStateID) || attic
    currentState = darkAttic
    
    updateState();
});

const attic = {
    "ID": 2,
    "room": "Attic",
    "description": `${displayName}, you step into the attic, swallowed by complete darkness. The air is thick with dust, and the wooden floor creaks beneath your feet. Without a light, you can’t see a thing. `,
    "ImageHREF": "Images/guestBedroomFinal.jpg",
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
    sessionStorage.setItem('currentState',1);
    window.location.replace('upstairsHall.html');
}

function searchBoxes(){

}


