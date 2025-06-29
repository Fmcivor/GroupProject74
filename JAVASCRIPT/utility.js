//Lead Developer: Fintan

//cariables for database conection
const dbConnectorUrl = "https://fmcivor02.webhosting1.eeecs.qub.ac.uk/dbConnector.php";

let dbConfig = new URLSearchParams({
    hostname: 'localhost',
    username: 'fmcivor02',
    password: 'B12nJ0xSkjJ27PQV',
    database: 'CSC1034_CW_74',
});

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

//remove a save from the database
async function deleteSave(gameID){
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


