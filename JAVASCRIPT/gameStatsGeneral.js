//DEVELOPER: CALLUM

//PLACEHOLDERS
let userID = sessionStorage.getItem('userID');
let gameID = sessionStorage.getItem('gameID')

//CONSTANTS
const numOfClues = 9;
const numOfItems = 7;
const numOfRooms = 9;

const playTimeDisplay = document.getElementById('playTimeDisplay');
const saveStartedDisplay = document.getElementById('saveStartedDisplay');
const completionDisplay = document.getElementById('completionDisplay');
const roomsVisitedDisplay = document.getElementById('roomsVisitedDisplay');
const cluesFoundDisplay = document.getElementById('cluesFoundDisplay');
const itemsCollectedDisplay = document.getElementById('itemsCollectedDisplay');

// VARIABLES
let timeToComplete = 0;
let startDate = null;
let startTime = null;
let completion = 0;
let roomsVisited = 0;
let itemsCollected = 0;
let cluesCollected = 0;


async function loadStats() {
    
    getplayTime();
    getItemsAndClues();
    getRooms();
}

//get stats for number of rooms visited
async function getRooms() {
    let timeAndRoomsQuery = `SELECT timesVisited FROM tblGameRoom WHERE gameID = ${gameID};`;

    dbConfig.set('query', timeAndRoomsQuery);

    try {
        let response = await fetch(dbConnectorUrl, {
            method: "POST",
            body: dbConfig
        });

        let result = await response.json();

        if (result.success && result.data.length > 0) {
            for( let i = 0; i<9; i++) {
                if(result.data[i].timesVisited > 0){
                    roomsVisited++;

                    //calculate completion
                    completion = ((5*roomsVisited) + (8*itemsCollected) + (7*cluesCollected)) / ((5*numOfRooms) + (8*numOfItems) + (7*numOfClues))
                    completion = completion * 100;
                    completion = Math.round(completion * 10) / 10

                    completionDisplay.textContent = `${completion}%`;
                    roomsVisitedDisplay.textContent = `${roomsVisited}/${numOfRooms}`;
                }
            }
        }
        else {
            console.error("Unable to retrieve stats form the database");
        }
    } catch (error) {
        console.error("An error has occurred while retrieving stats form the database", error);
    }
}

//get stats for items and clues collected
async function getItemsAndClues() {
    //items stats retrieved
    let itemQuery = `SELECT COUNT(itemID) AS 'noItemsCollected' FROM tblGameInventory WHERE gameID = ${gameID};`;

    dbConfig.set('query', itemQuery);

    try {
        let response = await fetch(dbConnectorUrl, {
            method: "POST",
            body: dbConfig
        });

        let result = await response.json();

        if (result.success && result.data.length > 0) {
            itemsCollected = result.data[0].noItemsCollected;

            itemsCollectedDisplay.textContent = `${itemsCollected}/${numOfItems}`;
        }
        else {
            console.error("Unable to retrieve stats form the database");
        }
    } catch (error) {
        console.error("An error has occurred while retrieving stats form the database", error);
    }

    //clue stats retrieved
    let clueQuery = `SELECT COUNT(clueID) AS 'noCluesCollected' FROM tblGameNotebook WHERE gameID = ${gameID};`;

    dbConfig.set('query', clueQuery);

    try {
        let response = await fetch(dbConnectorUrl, {
            method: "POST",
            body: dbConfig
        });

        let result = await response.json();

        if (result.success && result.data.length > 0) {
            cluesCollected = result.data[0].noCluesCollected;

            cluesFoundDisplay.textContent = `${cluesCollected}/${numOfClues}`;           
        }
        else {
            console.error("Unable to retrieve stats form the database");
        }
    } catch (error) {
        console.error("An error has occurred while retrieving stats form the database", error);
    }
}

//get stats for user play time
async function getplayTime() {
    let timeAndRoomsQuery = `SELECT  timePlayed AS 'timeToComplete', DATE_FORMAT(startDate, '%d/%m/%Y') AS 'startDate', DATE_FORMAT(startDate, '%H:%i') AS 'startTime'
     FROM tblGameSave WHERE gameID = ${gameID};`;

    dbConfig.set('query', timeAndRoomsQuery);

    try {
        let response = await fetch(dbConnectorUrl, {
            method: "POST",
            body: dbConfig
        });

        let result = await response.json();

        if (result.success && result.data.length > 0) {
            let stats = result.data[0];
            timeToComplete = stats.timeToComplete
            startDate = stats.startDate
            startTime = stats.startTime

            playTimeDisplay.textContent = `${timeToComplete}`;
            saveStartedDisplay.textContent = `${startTime}, ${startDate}`;
        }
        else {
            console.error("Unable to retrieve stats form the database");
        }
    } catch (error) {
        console.error("An error has occurred while retrieving stats form the database", error);
    }
}