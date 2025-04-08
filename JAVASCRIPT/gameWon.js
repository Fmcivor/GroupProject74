const achievementContainer = document.querySelector('.achievementContainer');
const achievementIcon = document.getElementById('achievementIcon');
const achievementName = document.getElementById('achName');
const achievementDesc = document.getElementById('achDesc');
let userAchievementIDs = JSON.parse(sessionStorage.getItem('achievementIDs'));
let userID = sessionStorage.getItem('userID');

document.addEventListener('DOMContentLoaded', function(){
    
    if (!userAchievementIDs.some(achievement => achievement.achievementID == 4)) {
        awardAchievement(4,userID,'Images/trophy.png');
    }

});


function displayAchievement(iconSRC, achName, achDesc) {
    achievementIcon.src = iconSRC;
    achievementName.innerHTML = achName;
    achievementDesc.innerHTML = achDesc;

    achievementContainer.classList.add('achExpanded')
    setTimeout(hideAchievement, 6500)
}
function hideAchievement() {
    achievementContainer.classList.remove('achExpanded')
}


async function awardAchievement(achievementID, userID, achievementIconAddress) {
    let insertQuery = `INSERT INTO tblUserAchievements (achievementID, userID) 
        VALUES (${achievementID}, ${userID});`;

    let newAchievement = { "achievementID": achievementID };
    userAchievementIDs.push(newAchievement);
    sessionStorage.setItem("achievementIDs", JSON.stringify(userAchievementIDs));

    dbConfig.set('query', insertQuery);

    try {
        response = await fetch(dbConnectorUrl, {
            method: "POST",
            body: dbConfig
        });

        let insertResult = await response.json();
        if (insertResult.success) {




            let selectQuery = `SELECT name, description FROM tblAchievement

        WHERE  achievementID = ${achievementID};`;


            dbConfig.set('query', selectQuery);
            try {
                response = await fetch(dbConnectorUrl, {
                    method: "POST",
                    body: dbConfig
                });

                let result = await response.json();

                if (result.success && result.data.length > 0) {
                    let achievement = result.data[0];
                    displayAchievement(achievementIconAddress, achievement.name, achievement.description)
                }

            } catch (error) {
                console.log("Error retrieving achievement data");
                console.log(error);
            }
        }
        else {
            console.error("Error saving the achievement to the database")
        }

    } catch (error) {
        console.log("Error setting achievement");
        console.log(error);
    }

    if (userAchievementIDs.length == 5) {
        await awardAchievement(6,userID,'Images/trophy.png');
    }
        
    
}


document.getElementById('backToMenuBtn').addEventListener('click',function(){
    window.location.replace("mainMenu.html");
});