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


