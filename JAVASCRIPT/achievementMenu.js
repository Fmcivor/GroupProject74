
document.addEventListener("DOMContentLoaded", async function () {
    let validUser = checkLogin();
    if (validUser == true) {

        document.getElementById('usernameDisplay').textContent = sessionStorage.getItem("displayName");

        let userID = sessionStorage.getItem("userID");

        await displayAllAchievements();
        highlightUnlockedAchievements();
    }
});

function highlightUnlockedAchievements() {
    const userAchievementIDs = JSON.parse(sessionStorage.getItem("achievementIDs")) || [];

    userAchievementIDs.forEach(achievement => {
        let achievementID = achievement.achievementID;

        document.getElementById(`achievement${achievementID}`).classList.add("unlocked");
    });
}


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