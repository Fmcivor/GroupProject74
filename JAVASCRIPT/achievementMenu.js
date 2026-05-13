const CRIME_DOESNT_REST_BUT_I_DO_ID = "6a0495d8147b125a84564fe1";
const ONE_HIT_WONDER_ID = "6a0495d8147b125a84564fe2";
const GLAMOUROUS_JOB_ID = "6a0495d8147b125a84564fe3";
const WINNING_WAYS_ID = "6a0495d8147b125a84564fe4";
const GETTING_THINGS_STARTED_ID = "6a0495d8147b125a84564fe5";
const COMPLETIONIST_ID = "6a0495d8147b125a84564fe6";
const BEHIND_CLOSED_DRAWERS_ID = "6a0495d8147b125a84564fe7";


document.addEventListener("DOMContentLoaded", function () {
    // checkLogin();

let userID = sessionStorage.getItem("userID");

    document.getElementById('usernameDisplay').textContent = sessionStorage.getItem("username");

    // Highlight unlocked achievements
    highlightUnlockedAchievements();
});

function highlightUnlockedAchievements() {
    const userAchievementIDs = JSON.parse(sessionStorage.getItem("achievementIDs")) || [];
    const convertedAchievementIds = userAchievementIDs.map(id => getAchievementNumber(id)).filter(num => num !== null);
    const achievements = document.querySelectorAll('.achievement');

    achievements.forEach(achievement => {
        const achievementID = achievement.id.replace('achievement', '');
        console.log(achievementID);
        console.log(userAchievementIDs);
        if (convertedAchievementIds.includes(achievementID)) {
            console.log(achievementID  + " is unlocked.");
            achievement.classList.add('unlocked');
        }
    });
}

function getAchievementNumber(achievementId) {
    switch (achievementId) {
        case CRIME_DOESNT_REST_BUT_I_DO_ID:
            return "8";

        case ONE_HIT_WONDER_ID:
            return "8";

        case GLAMOUROUS_JOB_ID:
            return "3"  ;

        case WINNING_WAYS_ID:
            return "4";

        case GETTING_THINGS_STARTED_ID:
            return "5";

        case COMPLETIONIST_ID:
            return "6";

        case BEHIND_CLOSED_DRAWERS_ID:
            return "8";

        default:
            return null;
    }
}