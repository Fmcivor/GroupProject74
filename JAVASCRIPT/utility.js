//Lead Developer: Fintan

//variables for database connection (commented out - using localStorage instead)
/*
const dbConnectorUrl = "https://fmcivor02.webhosting1.eeecs.qub.ac.uk/dbConnector.php";

let dbConfig = new URLSearchParams({
    hostname: 'localhost',
    username: 'fmcivor02',
    password: 'B12nJ0xSkjJ27PQV',
    database: 'CSC1034_CW_74',
});
*/

// localStorage helper functions
function lsGet(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}

function lsSave(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function generateID() {
    let counter = parseInt(localStorage.getItem('ls_idCounter') || '0');
    counter++;
    localStorage.setItem('ls_idCounter', counter);
    return counter;
}

// adds two HH:MM:SS time strings together and returns the result as a HH:MM:SS string
function addTimeStrings(time1, time2) {
    let toSeconds = function(t) {
        let parts = (t || '00:00:00').split(':').map(Number);
        return (parts[0] * 3600) + (parts[1] * 60) + (parts[2] || 0);
    };
    let total = toSeconds(time1) + toSeconds(time2);
    let h = Math.floor(total / 3600);
    let m = Math.floor((total % 3600) / 60);
    let s = total % 60;
    return `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
}

// static item definitions (previously stored in tblItem)
const lsItems = [
    { itemID: 1, itemName: "Key",         itemHREF: "Images/goldKey.png" },
    { itemID: 2, itemName: "Lockpick",    itemHREF: "Images/lockpick.png" },
    { itemID: 3, itemName: "Batteries",   itemHREF: "Images/batteries.png" },
    { itemID: 4, itemName: "Pill Bottle", itemHREF: "Images/pillBottle.png" },
    { itemID: 5, itemName: "Safe Code",   itemHREF: "Images/secretCodeNote.png" },
    { itemID: 6, itemName: "Flashlight",  itemHREF: "Images/flashlight.png" },
    { itemID: 7, itemName: "Knife",       itemHREF: "Images/bloodyKnife.png" },
    { itemID: 8, itemName: "Ring",        itemHREF: "Images/ring.png" },
];

// static clue definitions (previously stored in tblClue)
const lsClues = [
    { clueID: 1, clueText: "A crumpled note found in the rubbish outside. It reads: 'I know what you did, Victor. The truth will come out.'" },
    { clueID: 2, clueText: "A partially burnt letter retrieved from the fireplace. You can make out: 'Victor, I know what you did. If you don\u2019t meet with me, I will tell everyone.'" },
    { clueID: 3, clueText: "An expensive ring found in the downstairs hallway. It bears an inscription: 'C & V Forever'." },
    { clueID: 4, clueText: "Financial records on the study computer reveal large sums of money transferred from Charles to Victor shortly before the murder." },
    { clueID: 5, clueText: "A bloody knife discovered hidden inside the safe in the master bedroom. This appears to be the murder weapon." },
    { clueID: 6, clueText: "An empty bottle of pills found in the guest bedroom. The prescription label has been torn off." },
    { clueID: 7, clueText: "An email from Jonathan to Charles, dated 9th February 2006: 'Charles, It\u2019s been too long. I hate how we left things... Let\u2019s meet for a drink \u2014 no tension, just a proper conversation. \u2014 Jonathan'" },
    { clueID: 8, clueText: "A secret note found in the locked study drawer. It contains a safe code: 1907." },
    { clueID: 9, clueText: "Something significant discovered in the attic that links the suspect to the crime scene." },
];

// static achievement definitions (previously stored in tblAchievement)
const lsAchievements = [
    { achievementID: 1, name: "Sofa Sleuth",      description: "You sat on the sofa 5 times. Maybe take a break from the investigation?" },
    { achievementID: 2, name: "Mechanic",          description: "You repaired the generator and restored power to the house." },
    { achievementID: 3, name: "Jewellery Inspector", description: "You tried on the ring... strictly for investigative purposes." },
    { achievementID: 4, name: "Case Closed",       description: "You solved the mystery and identified the killer. Well done, detective!" },
    { achievementID: 5, name: "Note Taker",        description: "You found your first clue and added it to your notebook." },
    { achievementID: 6, name: "Completionist",     description: "You unlocked all other achievements. True detective!" },
    { achievementID: 7, name: "Explorer",          description: "You visited every room in the house." },
    { achievementID: 8, name: "Lock Expert",       description: "You successfully picked the lock on the study drawer." },
];

//Collectibles' classes
class Item {
    constructor(itemID, itemName, itemHREF) {
        this.itemID = itemID;
        this.itemName = itemName;
        this.itemHREF = itemHREF;
        this.itemUsed = false;
    }
}

class Clue{
    constructor(clueID,clueText){
        this.clueID = clueID;
        this.clueText = clueText;
    }
}

//load preferences
document.addEventListener('DOMContentLoaded',function(){
    document.documentElement.style.fontSize = `${sessionStorage.getItem('fontSize')}px`;
    let easyReadOn = JSON.parse(sessionStorage.getItem("easyReadOn"));
    if (easyReadOn == true) {
        document.documentElement.style.fontFamily = 'Arial, Helvetica, sans-serif';
    }
    else {
        document.documentElement.style.fontFamily = '"merriweather", serif';
    }
});

function checkLogin(){
    if (!sessionStorage.getItem('userID')) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

//remove a save (mark as abandoned) using localStorage
function deleteSave(gameID){
    /*
    // database version (commented out)
    let deleteQuery = `UPDATE tblGameSave SET status = ${gameAbandoned} WHERE gameID = ${gameID}`;
    dbConfig.set('query', deleteQuery);
    try {
        let response = await fetch(dbConnectorUrl,{
            method:"POST",
            body:dbConfig
        });
        let result = await response.json();
        if (result.success) {
            console.log("Successfully deleted game save");
        }
        else{
            console.error("Error while deleting the game save");
        }
    } catch (error) {
        console.error("Error while deleting the game save",error);
    }
    */

    let gameSaves = lsGet('ls_gameSaves');
    let idx = gameSaves.findIndex(g => String(g.gameID) === String(gameID));
    if (idx !== -1) {
        gameSaves[idx].status = gameAbandoned;
        lsSave('ls_gameSaves', gameSaves);
        console.log("Successfully deleted game save");
    } else {
        console.error("Error while deleting the game save: game not found");
    }
}

//hash input password
async function hashPassword(password) {
    
    const encoder = new TextEncoder();
    const data = encoder.encode(password);

    const hashBuffer = await crypto.subtle.digest('SHA-256', data);

    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    return hashHex;
  }


// game status constants

const activeGame = 0;
const gameWin = 1;
const gameLoss = 2;
const gameAbandoned = 3;


