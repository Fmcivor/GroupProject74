//INITIALISE
document.addEventListener('DOMContentLoaded', function () {
    currentState = enteredLivingRoom;
    updateState();
    getSessionStorage();
})

async function getSessionStorage(){
    
    let query = `SELECT timesOnSofa FROM tblGameSave WHERE gameID = '${gameID}';`;

    dbConfig.set('query', query);

    try {
        response = await fetch(dbConnectorUrl, {
            method: "POST",
            body: dbConfig
        });

        let result = await response.json();

        if (result.success && result.data.length > 0) {
            let gameSave = result.data[0];
            sessionStorage.setItem("timesOnSofa", gameSave.timesOnSofa);
            timesOnSofa = Number(sessionStorage.getItem("timesOnSofa"));
        }
    } catch (error) {
        console.log("Error retrieving timesOnSofa");
        console.log(error);
    }
}

//CONSTANTS



//VARIABLES
inventory = JSON.parse(sessionStorage.getItem("inventory"));
UpdateInventory();
let timesOnSofa = -1;
let gameID = 24;


//GAME STATES
/*
const template = {
    "room": "Living Room",
    "description": `description`,
    "ImageHREF": "jpg",
    "interactions": [
        {
            "id": 0,
            "Text": "text",
            "response": getOffSofa
        },
        {
            "id": 1,
            "Text": "text",
            "response": examineFireplace
        },
        {
            "id": 2,
            "Text": "text",
            "response": lookAtShelves
        },
        {
            "id": 3,
            "Text": "text",
            "response": checkRug
        }
    ]
}
*/

const enteredLivingRoom = {
    "room": "Living Room",
    "description": `You have entered a large worn living room. 
                    A large window covers the far wall illuminating the room whilst casting long shadows across it. 
                    A sagging sofa faces a scratched coffee table, and a faded rug lies beneath. 
                    The fireplace, a warm focal point of the room, is now cold, its bricks darkened with soot. 
                    Dust-laden shelves in the corner add to the tired atmosphere.`,
    "ImageHREF": "Images/livingRoom.jpg",
    "interactions": [
        {
            "id": 0,
            "Text": "Sit on the sofa",
            "response": sitOnSofa
        },
        {
            "id": 1,
            "Text": "Examine the fireplace",
            "response": examineFireplace
        },
        {
            "id": 2,
            "Text": "Take a closer look at the shelves",
            "response": lookAtShelves
        },
        {
            "id": 3,
            "Text": "Check under the rug",
            "response": "You look underneath the rug, but find nothing but a faceful of dust"
        }
    ]
}

const satOnSofa = {
    "room": "Living Room",
    "description": `You sit on the comfy sofa and take a brief minute to rest and evaluate your notes.`,
    "ImageHREF": "Images/livingRoom.jpg",
    "interactions": [
        {
            "id": 0,
            "Text": "Get up and continue investigating",
            "response": getOffSofa
        },
        {
            "id": 1,
            "Text": "Stay a little longer",
            "response": sitLonger
        },
    ]
}
const satOnSofaAgain = {
    "room": "Living Room",
    "description": `You sit back down on the comfy sofa and taking another brief minute to rest and evaluate your notes.`,
    "ImageHREF": "Images/livingRoom.jpg",
    "interactions": [
        {
            "id": 0,
            "Text": "Get up and continue investigating",
            "response": getOffSofa
        },
        {
            "id": 1,
            "Text": "Stay a little longer",
            "response": sitLonger
        },
    ]
}

const standUpFromSofa = {
    "room": "Living Room",
    "description": `You finally manage to get up from the sofa and continue investigating the room.`,
    "ImageHREF": "Images/livingRoom.jpg",
    "interactions": [
        {
            "id": 0,
            "Text": "Sit on the sofa",
            "response": sitOnSofa
        },
        {
            "id": 1,
            "Text": "Examine the fireplace",
            "response": examineFireplace
        },
        {
            "id": 2,
            "Text": "Take a closer look at the shelves",
            "response": lookAtShelves
        },
        {
            "id": 3,
            "Text": "Check under the rug",
            "response": "You look underneath the rug, but find nothing but a faceful of dust"
        },
        {
            "id": 4,
            "Text": "Look around the room",
            "response": lookAround
        }
    ]
}





//GAME RESPONSE FUNCTIONS
function lookAround(){
    currentState = enteredLivingRoom;
    updateState();
}

function sitOnSofa() {
    if(timesOnSofa === -1){
        currentState = satOnSofa;
        updateState();
        timesOnSofa++;
    }
    else if(timesOnSofa > 4){
        setResponse("I think you've spent enough time on the sofa already...");
    }
    else{
        currentState = satOnSofaAgain;
        updateState();
    }
}

function sitLonger() {
    switch(timesOnSofa){
        case 0:
            timesOnSofa++;
            setResponse("The sofa is so comfortable you decide to rest a little longer, being a detective can be a draining job after all and you deserve it!");
        break;

        case 1:
            timesOnSofa++;
            setResponse("Even with the trial racing closer and a lack of hard evidence, you continue to rest after all you need your mind to be well rested to find the killer.");
        break;

        case 2:
            timesOnSofa++;
            setResponse("Even with the trial racing closer and a lack of hard evidence, you continue to rest after all you need your mind to be well rested to find the killer.");
        break;

        case 3:
            timesOnSofa++;
            setResponse("Whilst some would call you lazy, you decide to rest a bit longer even though your running out of time to catc the killer");
        break;

        case 4:
            timesOnSofa++;
            setResponse("With questionable dedication to your job, you sit on the sofa EVEN LONGER! Putting tax payer money to incredible use");
        break;

        default:
            if(satOnSofa.interactions.length === 2){
                satOnSofa.interactions.pop();
                satOnSofaAgain.interactions.pop();
                updateState();
            }
            setResponse("After wasting far too much time you decide to actually do your job.");
        break;
    }
}

function getOffSofa() {
    updateTimesOnSofa();
    currentState = standUpFromSofa;
    updateState();
}

function examineFireplace() {

}

function lookAtShelves() {
    setResponse(
        "The shelve are mostly full of pictures and certificates from charles achievements."
        + "You find it odd that there are no photos of Mr and Mrs Kingston together and you notice empty, "
        + "slightly less dusty spots, wehere these pictures might've once been. You decide to take note of this."
    )
    addClue("You believe that any photos of Mr and Mrs Kingston have been removed suggesting the marriage was on shaky terms")
}

async function updateTimesOnSofa(){
    sessionStorage.setItem("timesOnSofa", timesOnSofa);

    let query = `UPDATE tblGameSave SET timesOnSofa = '${timesOnSofa}' WHERE gameID = '${gameID}';`;

    dbConfig.set('query', query);

    try {
        response = await fetch(dbConnectorUrl, {
            method: "POST",
            body: dbConfig
        });

    } catch (error) {
        console.log("Error updating tblGameSave");
        console.log(error);
    }
    
    if(timesOnSofa === 5) {
        let achSRC = 'Images/sofaAchievementIcon.jpg';
        awardAchievement(1, 1, achSRC)
    }
}

