//Dylan's code
document.addEventListener("DOMContentLoaded", async function () {
    let validUser = checkLogin();
    if (validUser == true) {
        // Set the username in the header
        document.getElementById('usernameDisplay').textContent = sessionStorage.getItem("displayName");

        let userID = sessionStorage.getItem("userID");
        // gets the achievements for the user from the database
        await displayAllAchievements();
        highlightUnlockedAchievements();
    }
});
// function to highlight the achievements that are unlocked
function highlightUnlockedAchievements() {
    const userAchievementIDs = JSON.parse(sessionStorage.getItem("achievementIDs")) || [];
    // Loops through the userAchievementIDs
    userAchievementIDs.forEach(achievement => {
        let achievementID = achievement.achievementID;
        // Add the "unlocked" class to the achievement element
        document.getElementById(`achievement${achievementID}`).classList.add("unlocked");
    });
}

// Displays all the achievements from the database
async function displayAllAchievements() {

    let query = `SELECT * FROM tblAchievement`;
    dbConfig.set("query", query);
    try {
        let response = await fetch(dbConnectorUrl, {
            method: "POST",
            body: dbConfig
        });

        let result = await response.json();

        if (result.success) {
            let achievements = result.data;

            const achievementsContainer = document.querySelector(".achievements-container");
            achievementsContainer.innerHTML = "";

            achievements.forEach(achievement => {
                let achievementHTML = `<div class="achievement-wrapper">
            <div id="achievement${achievement.achievementID}" class="achievement">
                <h3>${achievement.name}</h3>
                <span class="description">${achievement.description}</span>
            </div>`;
                achievementsContainer.innerHTML += achievementHTML;
            });

        }
        else {
            console.error("Error fetching achievements:");
        }
    } catch (error) {
        console.error("Error fetching achievements", error);
    }
}