const dbConnectorUrl = "https://fmcivor02.webhosting1.eeecs.qub.ac.uk/dbConnector.php";

let dbConfig = new URLSearchParams({
    hostname: 'localhost',
    username: 'fmcivor02',
    password: 'B12nJ0xSkjJ27PQV',
    database: 'CSC1034_CW_74',
});

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

document.addEventListener('DOMContentLoaded',function(){
    document.documentElement.style.fontSize = `${sessionStorage.getItem('fontSize')}px`;
    let easyReadOn = JSON.parse(sessionStorage.getItem("easyReadOn"));
    if (easyReadOn == true) {
        document.documentElement.style.fontFamily = 'Arial, Helvetica, sans-serif'
    }
    else {
        document.documentElement.style.fontFamily = '"merriweather", serif';
    }
})



