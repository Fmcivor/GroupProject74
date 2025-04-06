//INITIALISE
window.addEventListener('DOMContentLoaded', async function() {
    await getAvgTimes();
    await loadStats();
})

//CONSTANTS
const averageTTWDisplay = document.getElementById('averageTTWDisplay');
const globalAverageTTWDisplay = document.getElementById('globalAverageTTWDisplay');

// VARIABLES
let avgTimeToComplete = 0;
let globalAvgTimeCompletion = 0;





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



