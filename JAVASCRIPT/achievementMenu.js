
document.addEventListener("DOMContentLoaded", function () {
    checkLogin();

let userID = sessionStorage.getItem("userID");

    document.getElementById('usernameDisplay').textContent = sessionStorage.getItem("username");

    // Highlight unlocked achievements
    highlightUnlockedAchievements();
});

function highlightUnlockedAchievements() {
    const userAchievementIDs = JSON.parse(sessionStorage.getItem("achievementIDs")) || [];
    const achievements = document.querySelectorAll('.achievement');

    achievements.forEach(achievement => {
        const achievementID = achievement.id.replace('achievement', '');
        console.log(achievementID);
        console.log(userAchievementIDs);
        if (userAchievementIDs.includes(achievementID)) {
            console.log(achievementID  + " is unlocked.");
        }
    });
}