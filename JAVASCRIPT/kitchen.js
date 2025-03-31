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
            "response": leaveKitchen
        }
    ]
}

const leftKitchen = {
    "ID": 2,
    "room": "Kitchen",
    "description": `You step into a dimly lit kitchen, the air thick with the scent of stale wine and something metallic. 
                    The countertops are cluttered with unwashed dishes, and a faint, sticky stain glistens under the light. 
                    A broken wine glass lies shattered near the sink.`,
    "ImageHREF": "Images/kitchenWine.jpg",
    "interactions": [
        {
            "id": 0,
            "Text": "Enter living room",
            "response": enterLivingRoom
        },
        {
            "id": 1,
            "Text": "Enter hallway",
            "response": searchDrawers
        },
        {
            "id": 2,
            "Text": "Enter dining room",
            "response": enterDiningRoom
        },
        {
            "id": 3,
            "Text": "Return to kitchen",
            "response": returnToKitchen
        }
    ]
}

document.addEventListener('DOMContentLoaded', async function () {

    let states = [];

    states.push(kitchenDefault,leftKitchen);
  
    // let currentStateID = Number(sessionStorage.getItem('currentState'));
    // states.forEach(state => {
    //     if (state.ID == currentStateID) {
    //         currentState = state;
    //         return;
    //     }
    // });
    currentState = kitchenDefault;
    updateState();
})

function returnToKitchen(){
    currentState = kitchenDefault;
    updateState();
}

function leaveKitchen(){
    currentState = leftKitchen;
    updateState();
}

function checkCounterTop(){
    let button = document.getElementById(responseId);
    button.style.color = 'rgb(153, 153, 153)';
    button.querySelector('i').style.color = 'rgb(153, 153, 153)';
    setResponse("You inspect the messy countertop. You notice a dried wine stain. There’s also an open wine bottle, half empty, with a faint fingerprint smudge near the neck.");
}

function searchDrawers(){
    let button = document.getElementById(responseId);
    button.style.color = 'rgb(153, 153, 153)';
    button.querySelector('i').style.color = 'rgb(153, 153, 153)';
    setResponse("You pull open the drawers, rummaging through shiny silverware and scattered papers. In the back of one drawer, your fingers brush against some small batteries, maybe for a torch? You take them.")
}

function examineGlass(){
    let button = document.getElementById(responseId);
    button.style.color = 'rgb(153, 153, 153)';
    button.querySelector('i').style.color = 'rgb(153, 153, 153)';
    setResponse("Shards of the shattered glass glisten under the dim light. The way the glass is spread suggests it was knocked over with force, not simply dropped. A tiny smear of blood on one of the pieces catches your eye - someone was cut here.")
}

function enterLivingRoom(){
    window.location.href = 'livingRoom.html'
}


function enterLivingRoom(){
    window.location.href = 'livingRoom.html'
    currentState = 0;
    updateState();
}

function enterhallway(){
    window.location.href = 'hallway.html'
    currentState = 0;
    updateState();
}

function enterDiningRoom(){
    window.location.href = 'diningRoom.html'
    currentState = 0;
    updateState();
}