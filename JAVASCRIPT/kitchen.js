let hasBatteries;

const kitchenDefault = {
    "ID": 1,
    "room": "Kitchen",
    "description": `You step into a dimly lit kitchen, the air thick with the scent of stale wine and something metallic. 
                    The countertops are cluttered with unwashed dishes, and a faint, sticky stain glistens under the light. 
                    A broken wine glass lies shattered near the sink.`,
    "ImageHREF": "Images/kitchenWine.jpg",
    "interactions": [
        {
            "id": 0,
            "Text": "Check the countertops",
            "response": checkCounterTop
        },
        {
            "id": 1,
            "Text": "Search the Drawers",
            "response": searchDrawers
        },
        {
            "id": 2,
            "Text": "Examine broken glass",
            "response": examineGlass
        },
        {
            "id": 3,
            "Text": "Exit kitchen",
            "response": enterHallway
        }
    ]
}

document.addEventListener('DOMContentLoaded', async function () {

    let states = [];

    states.push(kitchenDefault);


    let currentStateID = Number(sessionStorage.getItem('currentState'));
    currentState = states.find(state => state.ID == currentStateID) || kitchenDefault;
    hasBatteries = inventory.some(item => item.itemID == batteriesID);
    updateState();
})

function returnToKitchen() {
    currentState = kitchenDefault;
    updateState();
}


function checkCounterTop() {
    setResponse("You inspect the messy countertop. You notice a dried wine stain. There’s also an open wine bottle, half empty, with a faint fingerprint smudge near the neck.");
}

async function searchDrawers() {
    if (hasBatteries) {
        setResponse("You pull open the drawers, rummaging through shiny silverware and scattered papers. You find nothing of interest.")
    }
    else {
        if (inventory.filter(item => item.itemUsed == false).length == 6) {
            setResponse("You must drop an item before you can pick up the batteries. HINT try using an item to get rid of it.");
        }
        else {
            hasBatteries = true;
            await addItem(batteriesID);
            setResponse("You pull open the drawers, rummaging through shiny silverware and scattered papers. In the back of one drawer, your fingers brush against some small batteries, maybe for a torch? You take them.");
        }
    }
}

function examineGlass() {
    setResponse("Shards of the shattered glass glisten under the dim light. The way the glass is spread suggests it was knocked over with force, not simply dropped. A tiny smear of blood on one of the pieces catches your eye - someone was cut here.")
}

function enterHallway() {
    goToNextRoom('downStairsHall.html', 4);
}