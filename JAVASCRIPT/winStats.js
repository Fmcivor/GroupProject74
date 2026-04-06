//DEVELOPER: CALLUM

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
    let timeToSeconds = function(t) {
        let parts = (t || '00:00:00').split(':').map(Number);
        return (parts[0] * 3600) + (parts[1] * 60) + (parts[2] || 0);
    };
    let secondsToTime = function(s) {
        let h = Math.floor(s / 3600);
        let m = Math.floor((s % 3600) / 60);
        let sec = s % 60;
        return `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${sec.toString().padStart(2,'0')}`;
    };

    /*
    // database version (commented out)
    //retrieve users average time to win
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

    //retrieve global average time to win
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
    */

    // localStorage version
    let gameSaves = lsGet('ls_gameSaves');

    // user average time to win
    let userWonGames = gameSaves.filter(g => String(g.userID) === String(userID) && Number(g.status) === 1);
    if (userWonGames.length > 0) {
        let avgSecs = Math.round(userWonGames.reduce((sum, g) => sum + timeToSeconds(g.timePlayed), 0) / userWonGames.length);
        avgTimeToComplete = secondsToTime(avgSecs);
        averageTTWDisplay.textContent = `${avgTimeToComplete}`;
    } else {
        averageTTWDisplay.textContent = 'N/A';
    }

    // global average time to win (all saves in localStorage)
    let allWonGames = gameSaves.filter(g => Number(g.status) === 1);
    if (allWonGames.length > 0) {
        let globalAvgSecs = Math.round(allWonGames.reduce((sum, g) => sum + timeToSeconds(g.timePlayed), 0) / allWonGames.length);
        globalAvgTimeCompletion = secondsToTime(globalAvgSecs);
        globalAverageTTWDisplay.textContent = `${globalAvgTimeCompletion}`;
    } else {
        globalAverageTTWDisplay.textContent = 'N/A';
    }
}



