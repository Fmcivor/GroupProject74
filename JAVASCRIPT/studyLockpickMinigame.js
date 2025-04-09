//Dylan's Lockpicking Minigame

const canvas = document.getElementById("lockpickCanvas");
const ctx = canvas.getContext("2d");

const totalStages = 5; //Number of vertical bars
let currentStage = 0; //Current bar player is on
let gameActive = true;
let animationFrameId;

const stageWidth = 55; //Wdith of each bar
const stageMargin = 20; //Space between bars
const barHeight = canvas.height;
const gapHeight = 30;

let stages = [];
for (let i = 0; i < totalStages; i++) {
  let randomTargetY = Math.floor(Math.random() * (barHeight - gapHeight)); // Creates a random target for each stage
  stages.push({
    gapY: 0,                     
    gapHeight: gapHeight,
    speed: 2 + (i/5), // Increase speed for each stage
    targetY: randomTargetY, //Sets the target for each stage
    x: stageMargin + i * (stageWidth + stageMargin)// x position of each stage
  });
}

function drawGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Loop through each stage
  for (let i = 0; i < totalStages; i++) {
    let stage = stages[i];
    
    ctx.fillStyle = "#333"; //color of the bar
    ctx.fillRect(stage.x, 0, stageWidth, barHeight);
    
    const markerHeight = 10; //height of red target
    ctx.fillStyle = "red";
    ctx.fillRect(stage.x, stage.targetY - markerHeight / 2, stageWidth, markerHeight);

    if (i === currentStage) {
      stage.gapY += stage.speed;
      if (stage.gapY < 0 || stage.gapY + stage.gapHeight > barHeight) {
        stage.speed = -stage.speed;
        stage.gapY += stage.speed; //reverse the moving rectangle
      }
      ctx.clearRect(stage.x, stage.gapY, stageWidth, stage.gapHeight);
      ctx.strokeStyle = "yellow"; //give moving rectangle a border
      ctx.strokeRect(stage.x, stage.gapY, stageWidth, stage.gapHeight);
    } 
    else if (i < currentStage) {
      ctx.clearRect(stage.x, stage.gapY, stageWidth, stage.gapHeight);
      ctx.strokeStyle = "green"; //if timed correctly, the gap is green
      ctx.strokeRect(stage.x, stage.gapY, stageWidth, stage.gapHeight);
    }
  }
  
  if (gameActive) {
    animationFrameId = requestAnimationFrame(drawGame);
  }
}

canvas.addEventListener("click", async function() {
  if (!gameActive) return;
  
  let stage = stages[currentStage];
  //Check if the target falls within the gap
  if (stage.targetY >= stage.gapY && stage.targetY <= stage.gapY + stage.gapHeight) {
    currentStage++;// Move to the next stage
    if (currentStage >= totalStages) { // If all stages are completed
      gameActive = false;
      canvas.style.display = "none"; // Hide the canvas
      if(!clueList.some(clue => clue.clueID == drawerClueID)){
        setResponse("You successfully picked the lock! The drawer slides open, revealing a note with a code on it. It reads: 4-3-7-9.");
        await addClue(drawerClueID);
        if(!userAchievementIDs.some((achievement => achievement.achievementID == 8))){
          await awardAchievement(8, userID, "Images/lockpick.png");
        }
      }
      else{
        setResponse("You successfully picked the lock! The drawer slides open, but it’s empty.");
      }
      cancelAnimationFrame(animationFrameId);
      document.getElementById('LockPickGameContainer').style.display = "none";
      return;
    }
  } else {
    // Wrong timing: reset the game
    gameActive = false;
    cancelAnimationFrame(animationFrameId);
    setTimeout(startLockPickGame, 1500);
  }
});

// Start the lockpicking minigame
function startLockPickGame() {
    currentStage = 0;
    gameActive = true;
    // Reset each stage's gap position and randomize the target marker
    stages.forEach(stage => {
      stage.gapY = 0;
      stage.targetY = Math.floor(Math.random() * (barHeight - gapHeight));
    });
    drawGame();
  }
  

startLockPickGame();
