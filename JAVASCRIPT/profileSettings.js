//LEAD DEVELOPER - FINTAN 
//Form styling and show button - MATTHEW



//^ DEVELOPMENT PURPOSES

let userID = sessionStorage.getItem("userID");
let username = sessionStorage.getItem("username");
let displayName = sessionStorage.getItem("displayName");
let fontSize = sessionStorage.getItem("fontSize");
let easyReadOn = JSON.parse(sessionStorage.getItem("easyReadOn"));

let errorMessage = '<ul>';

const displayNameInput = document.getElementById('displayName');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword')
const saveProfileBtn = document.getElementById('saveProfileBtn');
const exitProfileBtn = document.getElementById('exitProfileBtn');
const exitPreferencesBtn = document.getElementById('exitPreferencesBtn');
const exitStatsBtn = document.getElementById('exitStatsBtn');
const messageContainer = document.getElementById('messageContainer');
const profileTab = document.getElementById('profileTab');
const preferencesTab = document.getElementById('preferencesTab');
const statsTab = document.getElementById('statsTab');

const profileForm = document.getElementById('profileForm');
const preferencesForm = document.getElementById('preferencesForm');
const statsContainer = document.getElementById('statsContainer');

const easyReadCheckBox = document.getElementById('easyReadCheckBox')

profileTab.addEventListener("click", function () {
    profileTab.style.borderBottom = '4px solid rgb(0, 102, 255)';
    preferencesTab.style.borderBottom = '4px solid transparent';
    statsTab.style.borderBottom = '4px solid transparent';

    profileForm.style.display = 'flex'
    preferencesForm.style.display = 'none';
    statsContainer.style.display = 'none';

    displayNameInput.value = displayName
});

preferencesTab.addEventListener("click", function () {
    preferencesTab.style.borderBottom = '4px solid rgb(0, 102, 255)';
    profileTab.style.borderBottom = '4px solid transparent';
    statsTab.style.borderBottom = '4px solid transparent';

    preferencesForm.style.display = 'flex'
    profileForm.style.display = 'none';
    statsContainer.style.display = 'none';

    fontSlider.value = fontSize;
    let easyReadOn = JSON.parse(sessionStorage.getItem("easyReadOn")) === true;
    easyReadCheckBox.checked = easyReadOn;

});

statsTab.addEventListener('click', function () {
    preferencesTab.style.borderBottom = '4px solid transparent';
    profileTab.style.borderBottom = '4px solid transparent';
    statsTab.style.borderBottom = '4px solid rgb(0,102,255)';

    preferencesForm.style.display = 'none'
    profileForm.style.display = 'none';
    statsContainer.style.display = 'flex';



})



document.addEventListener('DOMContentLoaded', async function () {
    let validUser = checkLogin();
    if (validUser == true) {


        displayNameInput.value = displayName
        fontSlider.value = fontSize;
        easyReadCheckBox.checked = easyReadOn;

        await getGameStats();
        await getCollectibleStats();
        await getTimeStats();

        // await displayStats();
        document.getElementById('usernameDisplay').textContent = sessionStorage.getItem("displayName");
    }
});


const showButton = document.getElementById('togglePassword');
showButton.addEventListener('click', togglePassword);

function togglePassword() {
    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirmPassword");
    if (password.type == "password") {
        password.type = "text";
        confirmPassword.type = "text";
    } else {
        password.type = "password";
        confirmPassword.type = "password";
    }
}

document.getElementById('password').addEventListener('input', function (event) {
    const confirmPasswordField = document.getElementById('confirmPassword');
    if (event.target.value.trim() == '') {
        // confirmPasswordField.classList.add('disabled');
        confirmPasswordField.setAttribute('disabled', true);
        confirmPasswordField.value = '';

    }
    else {
        // confirmPasswordField.classList.remove('disabled');
        confirmPasswordField.removeAttribute('disabled');
    }
});



exitProfileBtn.addEventListener('click', function () {
    window.location.href = 'mainMenu.html';
});

exitPreferencesBtn.addEventListener('click', function () {

    window.location.href = 'mainMenu.html';
});

exitStatsBtn.addEventListener('click', function () {
    window.location.href = 'mainMenu.html';
});




saveProfileBtn.addEventListener('click', validateChanges);



async function validateChanges(event) {
    event.preventDefault();
    saveProfileBtn.setAttribute('disabled', true);
    //reset
    errorMessage = '<ul>';

    let enteredDisplayName = displayNameInput.value;
    let enteredPassword = passwordInput.value;
    let enteredConfirmPassword = confirmPasswordInput.value;

    let validDisplayName = validateDisplayName(enteredDisplayName);
    let validPassword = true;
    let validConfirmPassword = true;
    if (enteredPassword.trim() != '') {
        validPassword = validatePassword(enteredPassword);
        validConfirmPassword = validateConfirmPassword(enteredPassword, enteredConfirmPassword);
    }


    if (validDisplayName && validPassword && validConfirmPassword) {
        await updateProfile(enteredDisplayName, enteredPassword);
        displayNameInput.classList.remove('invalid');
        passwordInput.classList.remove('invalid');
        confirmPasswordInput.classList.remove('invalid');

        passwordInput.value = '';
        confirmPasswordInput.value = '';
        confirmPasswordInput.classList.add('disabled');
        confirmPasswordInput.setAttribute('disabled', true);
    }
    else {
        displayMessage(false);
    }

    saveProfileBtn.removeAttribute('disabled');
}



function validateDisplayName(enteredDisplayName) {
    let displayNameRegex = /^[a-zA-Z]{1,15}$/;

    if (displayNameRegex.test(enteredDisplayName) == false) {
        errorMessage += '<li>The display name must be letters only and less than 16 characters.</li>';
        displayNameInput.classList.add('invalid');
        return false;
    }

    displayNameInput.classList.remove('invalid');
    return true;
}

function validatePassword(enteredPassword) {
    let passwordRegex = /^(?=.*[!@#$%^&*])(?=.*[0-9])(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*]{8,20}$/;

    if (passwordRegex.test(enteredPassword) == false) {
        errorMessage += '<li>The password must be 8 or more characters long and contain at least 1 upper case character, number and special character.</li>';
        passwordInput.classList.add('invalid');
        return false;
    }

    passwordInput.classList.remove('invalid');
    return true;
}

function validateConfirmPassword(enteredPassword, enteredConfirmPassword) {
    if (enteredPassword !== enteredConfirmPassword) {
        errorMessage += '<li>The passwords must match.</li>';
        return false;
    }

    confirmPasswordInput.classList.remove('invalid');
    return true;
}


async function updateProfile(enteredDisplayName, enteredPassword) {
    let query;
    if (enteredPassword == '') {
        query = `UPDATE tblUser SET displayName ='${enteredDisplayName}' WHERE userID =${userID}`;
    }
    else {
        query = `UPDATE tblUser SET displayName ='${enteredDisplayName}', userPassword = '${enteredPassword}' WHERE userID =${userID}`;
    }
    dbConfig.set('query', query);

    try {
        let response = await fetch(dbConnectorUrl, {
            method: "POST",
            body: dbConfig
        });

        let result = await response.json();

        if (result.success) {
            displayMessage(true);
            sessionStorage.setItem("displayName", enteredDisplayName);
        }
    } catch (error) {
        alert("Error updating", error);
        console.log(error);
    }
}

function displayMessage(success) {
    let header = '';
    let headerColor = '';
    let message = '';
    if (success) {
        header = 'Success';
        headerColor = 'white';
        message += '<p style="text-align:center;">Your profile has successfully been updated!</p>';
        document.getElementById('messageContent').innerHTML = message;
    }
    else {
        header = 'Invalid';
        headerColor = 'red';

        errorMessage += '<ul>';

        document.getElementById('messageContent').innerHTML = errorMessage;
    }


    const headerElement = document.getElementById('messageHeader');
    headerElement.textContent = header;
    headerElement.style.color = headerColor;

    messageContainer.style.display = 'flex';



}

const closeBtn = document.querySelector('.closeBtn');
closeBtn.addEventListener('click', function () {
    messageContainer.style.display = 'none';
});


//preferences

const fontSlider = document.getElementById('slider');
const savePreferencesBtn = document.getElementById('savePreferencesBtn');

fontSlider.oninput = function () {
    document.getElementById('sampleText').style.fontSize = `${fontSlider.value}px`;
}

savePreferencesBtn.addEventListener('click', savePreferences);



async function savePreferences() {
    let easyReadOn = easyReadCheckBox.checked;
    sessionStorage.setItem("fontSize", fontSlider.value);
    sessionStorage.setItem("easyReadOn", easyReadOn);
    if (easyReadOn == true) {
        document.documentElement.style.fontFamily = 'Arial, Helvetica, sans-serif'
    }
    else {
        document.documentElement.style.fontFamily = '"merriweather", serif';
    }
    document.documentElement.style.fontSize = `${fontSlider.value}px`;


    let saveQuery = `UPDATE tblUser SET fontSize = ${fontSlider.value},easyReadOn = ${easyReadOn} WHERE userID = ${userID}`;
    dbConfig.set('query', saveQuery);


    try {
        let response = await fetch(dbConnectorUrl, {
            method: "POST",
            body: dbConfig
        });

        let result = await response.json();

        if (result.success) {
            console.log("Font size and easy read updated and saved");
        }

        else {

            console.error("Error occurred while saving the font size and easy read");
        }

    } catch (error) {

        console.error("Error while saving the font size and easy read", error);

    }

}


// async function displayStats() {
//     let statsQuery = `SELECT 
//     IFNULL(SEC_TO_TIME(SUM(TIME_TO_SEC(tblGameSave.timePlayed))), 'N/A') AS totalTimePlayed, 

//     IFNULL(SEC_TO_TIME(ROUND(AVG(CASE WHEN tblGameSave.status = 1 THEN TIME_TO_SEC(tblGameSave.timePlayed) END))), 'N/A') AS averageToWin,

//     (
//         SELECT COUNT(*) 
//         FROM tblGameInventory 
//         WHERE gameID IN (SELECT gameID FROM tblGameSave WHERE userID = ${userID})
//     ) AS numOfItemsCollected,

//     (
//         SELECT COUNT(*) 
//         FROM tblGameNotebook 
//         WHERE gameID IN (SELECT gameID FROM tblGameSave WHERE userID = ${userID})
//     ) AS numOfCluesCollected,

//     IFNULL(
//         SEC_TO_TIME(
//             MIN(CASE WHEN tblGameSave.status = 1 THEN TIME_TO_SEC(tblGameSave.timePlayed) END)
//         ), 'N/A'
//     ) AS fastestTimeToCompleteGame,

//     IFNULL(
//         SEC_TO_TIME(
//             ROUND(AVG(CASE WHEN tblGameSave.status != 4 THEN TIME_TO_SEC(tblGameSave.timePlayed) END))
//         ), 'N/A'
//     ) AS averageTime,

//     COUNT(DISTINCT CASE WHEN tblGameSave.status = 2 THEN tblGameSave.gameID END) AS gamesLost, 
//     COUNT(DISTINCT CASE WHEN tblGameSave.status = 1 THEN tblGameSave.gameID END) AS gamesWon,
//     COUNT(DISTINCT CASE WHEN tblGameSave.status = 3 THEN tblGameSave.gameID END) AS gamesAbandoned,
//     COUNT(DISTINCT tblGameSave.gameID) AS totalGames,

//     ROUND(AVG( CASE WHEN tblGameSave.noGeneratorRepairAttempts >0 THEN tblGameSave.noGeneratorRepairAttempts END)) AS avgNoOfRepairAttempts,

//     (
//         SELECT tblRoom.roomName
//         FROM tblRoom 
//         WHERE tblRoom.roomID = (
//             SELECT tblGameRoom.roomID
//             FROM tblGameRoom
//             JOIN tblGameSave ON tblGameSave.gameID = tblGameRoom.gameID
//             WHERE tblGameSave.userID = ${userID}
//             GROUP BY tblGameRoom.roomID
//             ORDER BY SUM(tblGameRoom.timesVisited) DESC
//             LIMIT 1
//         )
//     ) AS mostVisitedRoom

// FROM tblGameSave 
// WHERE tblGameSave.userID = ${userID}
// GROUP BY tblGameSave.userID`;

//     dbConfig.set('query', statsQuery);

//     try {
//         let response = await fetch(dbConnectorUrl, {
//             method: "POST",
//             body: dbConfig
//         });

//         let result = await response.json();

//         if (result.success) {
//             let stats = result.data[0];
//             document.getElementById("totalTimePlayed").textContent = stats.totalTimePlayed;
//             document.getElementById("avgTimeToWin").textContent = stats.averageToWin;
//             document.getElementById("itemCount").textContent = stats.numOfItemsCollected;
//             document.getElementById("clueCount").textContent = stats.numOfCluesCollected;
//             document.getElementById("quickestGame").textContent = stats.fastestTimeToCompleteGame;
//             document.getElementById("averageTime").textContent = stats.averageTime;
//             document.getElementById("lost").textContent = stats.gamesLost;
//             document.getElementById("won").textContent = stats.gamesWon;
//             document.getElementById("abandoned").textContent = stats.gamesAbandoned;
//             document.getElementById("totalGamesPlayed").textContent = stats.totalGames;
//             document.getElementById("avgRepairAttempts").textContent = stats.avgNoOfRepairAttempts;
//             document.getElementById("mostVisitedRoom").textContent = stats.mostVisitedRoom;
//         }
//         else {
//             console.error("Error occurred while retrieving the game stats");
//             console.error(result.error);
//         }
//     } catch (error) {
//         console.error("Error while retrieving the game stats", error);
//     }
// }


async function getTimeStats() {
    let timeQuery = `SELECT 
    IFNULL(SEC_TO_TIME(SUM(TIME_TO_SEC(tblGameSave.timePlayed))), 'N/A') AS totalTimePlayed, 
    
    IFNULL(SEC_TO_TIME(ROUND(AVG(CASE WHEN tblGameSave.status = 1 THEN TIME_TO_SEC(tblGameSave.timePlayed) END))), 'N/A') AS averageToWin,
    IFNULL(
        SEC_TO_TIME(
            MIN(CASE WHEN tblGameSave.status = 1 THEN TIME_TO_SEC(tblGameSave.timePlayed) END)
        ), 'N/A'
    ) AS fastestTimeToCompleteGame,

    IFNULL(
        SEC_TO_TIME(
            ROUND(AVG(CASE WHEN tblGameSave.status != 4 THEN TIME_TO_SEC(tblGameSave.timePlayed) END))
        ), 'N/A'
    ) AS averageTime
     
FROM tblGameSave 
WHERE tblGameSave.userID = ${userID}
GROUP BY tblGameSave.userID`;

    dbConfig.set('query', timeQuery);

    try {
        let response = await fetch(dbConnectorUrl, {
            method: "POST",
            body: dbConfig
        });

        let result = await response.json();

        if (result.success) {
            let stats = result.data[0];
            document.getElementById("totalTimePlayed").textContent = stats.totalTimePlayed;
            document.getElementById("avgTimeToWin").textContent = stats.averageToWin;
            document.getElementById("quickestGame").textContent = stats.fastestTimeToCompleteGame;
            document.getElementById("averageTime").textContent = stats.averageTime;
        }
        else {
            console.error("Error occurred while retrieving the time stats");
            console.error(result.error);
        }
    } catch (error) {
        console.error("Error while retrieving the time stats", error);
    }
}


async function getCollectibleStats() {
    let query = `SELECT
     COUNT(*) AS numOfItemsCollected 
     FROM tblGameSave 
     JOIN tblGameInventory ON tblGameSave.gameID = tblGameInventory.gameID 
     WHERE tblGameSave.userID = ${userID}`;

    dbConfig.set('query', query);

    try {
        let response = await fetch(dbConnectorUrl, {
            method: "POST",
            body: dbConfig
        });

        let result = await response.json();

        if (result.success) {
            let stats = result.data[0];
            document.getElementById("itemCount").textContent = stats.numOfItemsCollected;
        }
        else {
            console.error("Error occurred while retrieving the item stats");
            console.error(result.error);
        }

    } catch (error) {
        console.error("Error while retrieving the item stats", error);
    }


    let clueQuery = `SELECT
     COUNT(*) AS numOfCluesCollected FROM tblGameSave
     JOIN tblGameNotebook ON tblGameSave.gameID = tblGameNotebook.gameID 
     WHERE tblGameSave.userID = ${userID}`;

    dbConfig.set('query', clueQuery);

    try {
        let response = await fetch(dbConnectorUrl, {
            method: "POST",
            body: dbConfig
        });

        let result = await response.json();

        if (result.success) {
            let stats = result.data[0];
            document.getElementById("clueCount").textContent = stats.numOfCluesCollected;
        }
        else {
            console.error("Error occurred while retrieving the clue stats");
            console.error(result.error);
        }
    } catch (error) {
        console.error("Error while retrieving the clue stats", error);
    }
}

async function getGameStats() {
    let gameStats = `SELECT 
    COUNT(DISTINCT CASE WHEN tblGameSave.status = 2 THEN tblGameSave.gameID END) AS gamesLost, 
    COUNT(DISTINCT CASE WHEN tblGameSave.status = 1 THEN tblGameSave.gameID END) AS gamesWon,
    COUNT(DISTINCT CASE WHEN tblGameSave.status = 3 THEN tblGameSave.gameID END) AS gamesAbandoned,
    COUNT(DISTINCT tblGameSave.gameID) AS totalGames,
    
    ROUND(AVG( CASE WHEN tblGameSave.noGeneratorRepairAttempts >0 THEN tblGameSave.noGeneratorRepairAttempts END)) AS avgNoOfRepairAttempts,

    (
        SELECT tblRoom.roomName
        FROM tblRoom 
        WHERE tblRoom.roomID = (
            SELECT tblGameRoom.roomID
            FROM tblGameRoom
            JOIN tblGameSave ON tblGameSave.gameID = tblGameRoom.gameID
            WHERE tblGameSave.userID = ${userID}
            GROUP BY tblGameRoom.roomID
            ORDER BY SUM(tblGameRoom.timesVisited) DESC
            LIMIT 1
        )
    ) AS mostVisitedRoom

FROM tblGameSave 
WHERE tblGameSave.userID = ${userID}
GROUP BY tblGameSave.userID`;

    dbConfig.set('query', gameStats);

    try {
        let response = await fetch(dbConnectorUrl, {
            method: "POST",
            body: dbConfig
        });

        let result = await response.json();

        if (result.success) {
            let stats = result.data[0];
            document.getElementById("lost").textContent = stats.gamesLost;
            document.getElementById("won").textContent = stats.gamesWon;
            document.getElementById("abandoned").textContent = stats.gamesAbandoned;
            document.getElementById("totalGamesPlayed").textContent = stats.totalGames;
            document.getElementById("avgRepairAttempts").textContent = stats.avgNoOfRepairAttempts;
            document.getElementById("mostVisitedRoom").textContent = stats.mostVisitedRoom;
        }
        else {
            console.error("Error occurred while retrieving the game stats");
            console.error(result.error);
        }
    } catch (error) {
        console.error("Error while retrieving the game stats", error);
    }
}
