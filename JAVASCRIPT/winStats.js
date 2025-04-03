//INITIALISE
window.addEventListener('DOMContentLoaded', async function() {
    await loadStats();
    // displayStats();
})

//PLACEHOLDERS
const userID = 1;
const gameID = 364;

//CONSTANTS
const numOfClues = 6;
const numOfItems = 7;
const numOfRooms = 8;

const playTimeDisplay = document.getElementById('playTimeDisplay');
const saveStartedDisplay = document.getElementById('saveStartedDisplay');
const averageTTWDisplay = document.getElementById('averageTTWDisplay');
const globalAverageTTWDisplay = document.getElementById('globalAverageTTWDisplay');
const completionDisplay = document.getElementById('completionDisplay');
const roomsVisitedDisplay = document.getElementById('roomsVisitedDisplay');
const cluesFoundDisplay = document.getElementById('cluesFoundDisplay');
const itemsCollectedDisplay = document.getElementById('itemsCollectedDisplay');

// VARIABLES
let timeToComplete = 0;
let startDate = null;
let startTime = null;
let avgTimeToComplete = 0;
let globalAvgTimeCompletion = 0;
let completion = 0;
let roomsVisited = 0;
let itemsCollected = 0;
let cluesCollected = 0;

async function loadStats() {
    
     getplayTime();
     getAvgTimes();
     getItemsAndClues();
     getRooms();
}

async function getplayTime() {
    let timeAndRoomsQuery = `SELECT  timePlayed AS 'timeToComplete', DATE(startDate) AS 'startDate', TIME(startDate) AS 'startTime'
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
            startTime = result.startTime

            playTimeDisplay.textContent = `${timeToComplete}`;
            saveStartedDisplay.textContent = `${startDate}, ${startTime}`;
        }
        else {
            console.error("Unable to retrieve stats form the database");
        }
    } catch (error) {
        console.error("An error has occurred while retrieving stats form the database", error);
    }
}

async function getAvgTimes() {
    let avgTimeQuery = `SELECT SEC_TO_TIME(ROUND(AVG(timePlayed))) AS 'averageTimeToComplete' FROM tblGameSave 
                        WHERE tblGameSave.status = 1 GROUP BY userID HAVING userID = ${userID};`;

    dbConfig.set('query', avgTimeQuery);

    try {
        let response = await fetch(dbConnectorUrl, {
            method: "POST",
            body: dbConfig
        });

        let result = await response.json();

        if (result.success && result.data.length > 0) {
            avgTimeToComplete = result.data[0].averageTimeToComplete;
            averageTTWDisplay.textContent = `${avgTimeToComplete}`;
    
        }
        else {
            console.error("Unable to retrieve stats form the database");
        }
    } catch (error) {
        console.error("An error has occurred while retrieving stats form the database", error);
    }

    let globalAvgTimeQuery = `SELECT SEC_TO_TIME(ROUND(AVG(timePlayed))) AS 'globalAverageTimeToComplete' FROM tblGameSave 
                            WHERE tblGameSave.status = 1;`;

    dbConfig.set('query', globalAvgTimeQuery);

    try {
        let response = await fetch(dbConnectorUrl, {
            method: "POST",
            body: dbConfig
        });

        let result = await response.json();

        if (result.success && result.data.length > 0) {
            globalAvgTimeCompletion = result.data[0].globalAverageTimeToComplete;
            globalAverageTTWDisplay.textContent = `${globalAvgTimeCompletion}`;
        }
        else {
            console.error("Unable to retrieve stats form the database");
        }
    } catch (error) {
        console.error("An error has occurred while retrieving stats form the database", error);
    }
}

async function getItemsAndClues() {
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

                    completion = ((5*roomsVisited) + (8*itemsCollected) + (7*cluesCollected)) / ((5*numOfRooms) + (8*numOfItems) + (7*numOfClues))
                    completion = completion * 100;

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

function displayStats() {
    completion = ((5*roomsVisited) + (8*itemsCollected) + (7*cluesCollected)) / ((5*numOfRooms) + (8*numOfItems) + (7*numOfClues))
    completion = completion * 100;

    playTimeDisplay.textContent = `Play Time: ${timeToComplete}`;
    saveStartedDisplay.textContent = `Save Started: ${startDate}, ${startTime}`;
    averageTTWDisplay.textContent = `Average time to complete: ${avgTimeToComplete}`;
    globalAverageTTWDisplay.textContent = `Global Average Time to Complete: ${globalAvgTimeCompletion}`;
    completionDisplay.textContent = `Completion%: ${completion}%`;
    roomsVisitedDisplay.textContent = `Rooms Found: ${roomsVisited}/${numOfRooms}`;
    cluesFoundDisplay.textContent = `Clues Found: ${cluesCollected}/${numOfClues}`;
    itemsCollectedDisplay.textContent = `Items Collected: ${itemsCollected}/${numOfItems}`;
}