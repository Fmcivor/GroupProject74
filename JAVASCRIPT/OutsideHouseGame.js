//Lead Developer = FINTAN MCIVOR


//VARIABLES
let hasKey = false;
let doorUnlocked = JSON.parse(sessionStorage.getItem("frontDoorUnlocked"));
let hasClue1 = JSON.parse(sessionStorage.getItem("clue1"));

hasKey = inventory.some(item =>item.itemID == keyID);

let noGeneratorRepairAttempts = sessionStorage.getItem("noGeneratorRepairAttempts");
let selectedItemID = null;





let generatorAudio = new Audio("Audio/GeneratorStart.mp3");






//Minigame variables 
let redZoneStart = Math.floor(Math.random() * 359);
let redZoneEnd = redZoneStart + 40;
let count = 0;
let angle = 1;
let generatorInterval;
let remainingRepairMisses = 2;



//CONSTANTS - mainly html elements to save repetition of document.getelement call
const line = document.getElementById('line');
const circle = document.querySelector('.circle');
const clue1Btn = document.getElementById('clue1Btn');
const generatorProgressBar = document.getElementById('GeneratorProgressBar');
const rightColumn = document.querySelector(".rightColumn");
const startRepairButton = document.getElementById('startButton');
const repairButton = document.getElementById('repairButton');
const rubbishContainer = document.querySelector('.rubbishContainer');
startRepairButton.addEventListener('click', startRepair);


//CLASS
// let key = new item(1, "key", "Images/goldKey.png");




//GAME STATES

const frontOfHouseDoorLocked = {
    "ID":1,
    "room": "Front of House",
    "description": `${displayName}, you stand infront of a large house with a locked door infront of you and a path leading to your left`,
    "ImageHREF": "Images/outsideHouse.jpg",
    "interactions": [
        {
            "id": 0,
            "Text": "Check under the mat",
            "response": checkUnderMat
        },
        {
            "id": 1,
            "Text": "Follow the path to your left",
            "response": goToSideOfHouse
        },
        {
            "id": 2,
            "Text": "Enter house",
            "response": "You can't enter the house with the door being locked"
        }
    ]
}

const frontOfHouseDoorUnlocked = {
    "ID":2,
    "room": "Front of House",
    "description": "You stand infront of a large house with a now unlocked door infront of you and a path leading to your left",
    "ImageHREF": "Images/outsideHouse.jpg",
    "interactions": [
        {
            "id": 0,
            "Text": "Check under the mat",
            "response": checkUnderMat
        },
        {
            "id": 1,
            "Text": "Follow the path to your left",
            "response": goToSideOfHouse
        },
        {
            "id": 2,
            "Text": "Enter house",
            "response": enterHouse
        }

    ]
}

const sideOfHouse = {
    "ID":3,
    "room": "Side of House",
    "description": `You now stand in an overgrown garden with a faint streetlight illuminating it. 
                    There is  a small building beside you with a locked door, 
                    however the window seems to be open. There is also a rubbish bin toppled over beside you`,
    "ImageHREF": "Images/outsideHouse.jpg",
    "interactions": [
        {
            "id": 0,
            "Text": "Climb into the building",
            "response": enterGeneratorBuilding
        },
        {
            "id": 1,
            "Text": "Search rubbish",
            "response": searchRubbish
        },
        {
            "id": 2,
            "Text": "Explore Garden",
            "response": exploreGarden
        },
        {
            "id": 3,
            "Text": "Go to the front of the house",
            "response": goTofrontOfHouse
        }

    ]
}

const generatorBuilding = {
    "ID":4,
    "room": "Front of House",
    "description": "There is an old generator with powerlines leading to the house. It appears to be broken.",
    "ImageHREF": "Images/Generator.jpg",
    "interactions": [
        {
            "id": 0,
            "Text": "Climb Out",
            "response": goToSideOfHouse
        },
        {
            "id": 1,
            "Text": "Fix the Generator",
            "response": FixGenerator
        }
    ]
}




document.addEventListener('DOMContentLoaded', async function () {

    let states = [];
    states.push(frontOfHouseDoorLocked,frontOfHouseDoorUnlocked,sideOfHouse,generatorBuilding);
    
    
    // let inventorySelect = `SELECT tblGameInventory.itemID,tblItem.itemName, tblItem.itemHREF,itemUsed FROM tblGameInventory 
    // JOIN tblItem ON tblGameInventory.itemID = tblItem.itemID
    // WHERE gameID = ${sessionStorage.getItem('gameID')}`;

    // dbConfig.set('query',inventorySelect);

    // try {
    //     let inventoryResponse = await fetch(dbConnectorUrl,{
    //         method:"POST",
    //         body:dbConfig
    //     });

    //     let inventoryResult = await inventoryResponse.json();

    //     if (inventoryResult.success) {
    //         if (inventoryResult.data.length>0) {
    //             inventoryResult.data.forEach(item => {
    //                 let inventoryItem = new Item(item.itemID,item.itemName,item.itemHREF,item.itemUsed);
    //                 inventory.push(inventoryItem);
    //                 if (item.itemID == keyID) {
    //                     hasKey = true;
    //                 }
    //             });
    //         }
    //         else{
    //             inventory = [];
    //         }
            
            

    //         UpdateInventory();
    //     }
    //     else{
    //         console.error("error retrieving the inventory");
    //     }
    // } catch (error) {
    //     console.error("Error retrieving the inventory items:", error);
    // }



    let currentStateID = Number(sessionStorage.getItem('currentState'));
    states.forEach(state => {
        if (state.ID == currentStateID) {
            currentState = state;
            return;
        }
    });
    
    updateState();


})


//GANE RESPONSE FUNCTIONS

function goToSideOfHouse() {
    currentState = sideOfHouse;
    updateState();

    generatorAudio.pause();
}


async function checkUnderMat() {
    let button = document.getElementById(responseId);
    let responseParagraph = document.getElementById('responseParagraph');
    button.style.color = 'rgb(153, 153, 153)';
    button.querySelector('i').style.color = 'rgb(153, 153, 153)';

    if (hasKey) {
        responseParagraph.textContent = "There is nothing under here the key has already been taken";
    }
    else {
        responseParagraph.textContent = "There is a large golden key here and you lift it";
        hasKey = true;

        let query = `SELECT * FROM tblItem WHERE itemID = '${keyID}'`;

        dbConfig.set('query', query);

        try {
            response = await fetch(dbConnectorUrl, {
                method: "POST",
                body: dbConfig
            });

            let result = await response.json();

            if (result.success && result.data.length > 0) {
                let key = new Item();
                Object.assign(key, result.data[0]);
                key.itemUsed = false;
                inventory.push(key);
                sessionStorage.setItem("inventory",JSON.stringify(inventory));

                UpdateInventory();

                let saveItemQuery = `INSERT INTO tblGameInventory (GameID,itemID)
                                     VALUES(${sessionStorage.getItem("gameID")},${keyID})`;
                dbConfig.set("query",saveItemQuery);

                let saveItemResponse = await fetch(dbConnectorUrl,{
                    method:"POST",
                    body:dbConfig
                });

                let saveItemResult = await saveItemResponse.json();

                if (saveItemResult.success) {
                    console.log("Inventory Updated Successfully");
                }
                else{
                    console.error("Error saving the item to the inventory");
                }
            }
            else{
                console.error("Error saving the item to the inventory");
            }
        } catch (error) {
            console.log("Error adding the item to your inventory");
            console.log(error);
        }

    }
}

function enterHouse() {
    sessionStorage.setItem("inventory",JSON.stringify(inventory));
    window.location.href = "livingRoom.html";
}


function goTofrontOfHouse() {
    if (doorUnlocked) {
        currentState = frontOfHouseDoorUnlocked;
    }
    else {
        currentState = frontOfHouseDoorLocked;
    }

    updateState();
}



function searchRubbish(responseId) {
    let button = document.getElementById(responseId);
    let responseParagraph = document.getElementById('responseParagraph');
    responseParagraph.textContent = 'Click on the screen to try collect or find items in the rubbish';

    rubbishContainer.style.display = 'block';
    if (hasClue1) {
        clue1Btn.style.display = 'none';
        rightColumn.style.backgroundImage = 'url("Images/rubbishNoNote.jpg")';
    }
    else {
        clue1Btn.style.display = 'block';
        rightColumn.style.backgroundImage = 'url("Images/rubbish.jpg")';
    }
    button.style.color = 'rgb(153, 153, 153)';
    button.querySelector('i').style.color = 'rgb(153, 153, 153)';


}


function exploreGarden(responseId) {
    let button = document.getElementById(responseId);
    let responseParagraph = document.getElementById('responseParagraph');
    button.style.color = 'rgb(153, 153, 153)';
    button.querySelector('i').style.color = 'rgb(153, 153, 153)';


    responseParagraph.textContent = "You have walked through the garden and have come accross a section of uneven ground";
}


function enterGeneratorBuilding() {
    currentState = generatorBuilding;
    updateState();
    if (electricityOn) {
        document.getElementById('1').remove();
    }

}




function FixGenerator() {
    clearInterval(generatorInterval);
    line.style.transform = 'rotate(0deg)';
    angle = 1;
    generatorProgressBar.style.width = '0';
    redZoneStart = Math.floor(Math.random() * 359);
    redZoneEnd = redZoneStart + 40;
    count = 0;
    startRepairButton.style.display = 'block';
    repairButton.style.display = 'none';

    document.getElementById('GeneratorGameContainer').style.display = 'flex';

    if (redZoneEnd <= 360) {
        circle.style.background = `linear-gradient(black, black) padding-box,
    conic-gradient(
        black 0deg, 
        black ${redZoneStart}deg, 
        red ${redZoneStart}deg, 
        red ${redZoneEnd}deg, 
        black ${redZoneEnd}deg, 
        black 360deg
    ) border-box`;

    }
    else {
        let additionalRedAngle = redZoneEnd - 360;
        circle.style.background = `linear-gradient(black, black) padding-box,
    conic-gradient(
        red 0deg, 
        red ${additionalRedAngle}deg, 
        black ${additionalRedAngle}deg, 
        black ${redZoneStart}deg, 
        red ${redZoneStart}deg, 
        red 360deg
    ) border-box`;
    }

}

function startRepair() {
    noGeneratorRepairAttempts ++;
    startRepairButton.style.display = 'none';
    repairButton.style.display = 'block';
    const hammer = document.getElementById('hammerIcon');

    generatorInterval = setInterval(() => {
        line.style.transform = `rotate(${angle}deg)`;
        hammer.style.transform =`rotate(${angle}deg)`;
        angle++;
        if (angle > 360) {
            angle = 1;
        }
    }, 7);
}





repairButton.addEventListener('click', async function () {

    let success = false;

    if (redZoneEnd > 360) {
        if (angle > redZoneStart && angle < 360 || angle > 0 && angle < redZoneEnd - 360) {
            success = true;
        }
    }
    else {
        if (angle > redZoneStart && angle < redZoneEnd) {
            success = true;
        }
    }

    if (success) {
        count++;
        generatorProgressBar.style.width = count * 33.3 + '%';

        if (count == 3) {
            clearInterval(generatorInterval);
            electricityOn = true;
            generatorAudio.currentTime = 0;
            generatorAudio.play();
            electricityOn = true;

            if (remainingRepairMisses ==2 && noGeneratorRepairAttempts == 1 && hasAchievement2 == false ) {
                awardAchievement(2,userID,".jpg");
            }

        }
        else {

            redZoneStart = Math.floor(Math.random() * 359);
            redZoneEnd = redZoneStart + 40;

            if (redZoneEnd >= 360) {
                let additionalRedAngle = redZoneEnd - 360;
                circle.style.background = `linear-gradient(black, black) padding-box,
        conic-gradient(
            red 0deg, 
            red ${additionalRedAngle}deg, 
            black ${additionalRedAngle}deg, 
            black ${redZoneStart}deg, 
            red ${redZoneStart}deg, 
            red 360deg
        ) border-box`;
            }
            else {
                circle.style.background = `linear-gradient(black, black) padding-box,
                conic-gradient(
                    black 0deg, 
                    black ${redZoneStart}deg, 
                    red ${redZoneStart}deg, 
                    red ${redZoneEnd}deg, 
                    black ${redZoneEnd}deg, 
                    black 360deg
                ) border-box`;
            }

        }
        circle.style.width = '120px';
        circle.style.height = '120px';
        setTimeout(() => {
            circle.style.width = '100px';
            circle.style.height = '100px';
        }, 200);

    }
    else {
        remainingRepairMisses--;
        if (remainingRepairMisses === 0) {
            alert("you have used up all your attempts");
            clearInterval(generatorInterval);

            FixGenerator();


        }
    }


})


clue1Btn.addEventListener('click', function () {
    rightColumn.style.backgroundImage = 'URL("Images/rubbishNoNote.jpg")';
    clue1Btn.style.visibility = 'collapse';
    let clue = document.createElement("li");
    clue.textContent = "A letter dated the 27/03/2024 by Jonathan Donaghy contains threats and accusations that his loss of money and the failure of the business is victor's fault";
    document.getElementById('clueList').appendChild(clue);
    document.getElementById('responseParagraph').textContent = 'You have found a letter check your notebook to see its content';
    hasClue1 = true;


})






document.getElementById('useItemBtn').addEventListener('click', function () {


    if (selectedItemID != null) {
        if (currentState == frontOfHouseDoorLocked && selectedItemID == keyID) {
            currentState = frontOfHouseDoorUnlocked;
            updateState();
            document.getElementById('responseParagraph').textContent = 'You have unlocked the door now.';
            sessionStorage.setItem('frontDoorUnlocked',true);
           
        }
        else {
            document.getElementById('responseParagraph').textContent = "That didn't do anything, maybe try something else.";
        }
    }
    else{
        document.getElementById('responseParagraph').textContent = "You must select an item before you can use it";
    }

})
