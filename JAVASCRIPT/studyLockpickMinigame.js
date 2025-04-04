// Get the canvas and its context
const canvas = document.getElementById("lockpickCanvas");
const ctx = canvas.getContext("2d");

// Game settings
const totalStages = 5;         // Total number of vertical bars (stages)
let currentStage = 0;          // Index of the current active stage
let gameActive = true;
let animationFrameId;

// Parameters for each stage/bar
// Parameters for each stage/bar remain the same
const stageWidth = 55;        // Width of each vertical bar
const stageMargin = 20;        // Space between bars
const barHeight = canvas.height; // Full height of the canvas for each bar
const gapHeight = 30;          // Height of the moving gap

// Create stage objects; each stage has its own vertical gap properties, x-position, and a random targetY.
let stages = [];
for (let i = 0; i < totalStages; i++) {
  // Generate a random targetY such that it fits within the bar
  let randomTargetY = Math.floor(Math.random() * (barHeight - gapHeight));
  stages.push({
    gapY: 0,                     // Starting y-position of the gap
    gapHeight: gapHeight,
    speed: 2 + (i/5),                // Increase speed slightly for later stages
    targetY: randomTargetY,      // Set a random targetY for this stage
    x: stageMargin + i * (stageWidth + stageMargin) // x-position for the bar
  });
}


// Draw the game frame on the canvas
function drawGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Loop through each stage (vertical bar)
  for (let i = 0; i < totalStages; i++) {
    let stage = stages[i];
    
    // Draw the full bar background
    ctx.fillStyle = "#333";
    ctx.fillRect(stage.x, 0, stageWidth, barHeight);
    
    // Draw the target marker as a thicker red bar (rectangle)
    const markerHeight = 10; // Adjust this value to make the red bar taller (and the game easier)
    ctx.fillStyle = "red";
    ctx.fillRect(stage.x, stage.targetY - markerHeight / 2, stageWidth, markerHeight);

    
    if (i === currentStage) {
      // Active stage: animate the moving gap vertically
      stage.gapY += stage.speed;
      if (stage.gapY < 0 || stage.gapY + stage.gapHeight > barHeight) {
        stage.speed = -stage.speed;
        stage.gapY += stage.speed; // adjust after reversing
      }
      // "Cut out" the gap from the bar (clear that area)
      ctx.clearRect(stage.x, stage.gapY, stageWidth, stage.gapHeight);
      // Highlight the moving gap with a yellow border
      ctx.strokeStyle = "yellow";
      ctx.strokeRect(stage.x, stage.gapY, stageWidth, stage.gapHeight);
    } else if (i < currentStage) {
      // Locked stages (succeeded): show the gap in green at its locked position
      ctx.clearRect(stage.x, stage.gapY, stageWidth, stage.gapHeight);
      ctx.strokeStyle = "green";
      ctx.strokeRect(stage.x, stage.gapY, stageWidth, stage.gapHeight);
    }
    // Stages beyond currentStage simply show the static bar with the red target marker.
  }
  
  if (gameActive) {
    animationFrameId = requestAnimationFrame(drawGame);
  }
}

// When the canvas is clicked, check the current stage's gap
canvas.addEventListener("click", async function() {
  if (!gameActive) return;
  
  let stage = stages[currentStage];
  // Check if the target line (targetY) falls within the gap
  if (stage.targetY >= stage.gapY && stage.targetY <= stage.gapY + stage.gapHeight) {
    // Correct timing: lock this stage and move to the next
    currentStage++;
    if (currentStage >= totalStages) {
      // All stages complete—win the game
      gameActive = false;
      if(!clueList.some(clue => clue.clueID == drawerClueID)){
        setResponse("You successfully picked the lock! The drawer slides open, revealing a note with a code on it. It reads: 4-3-7-9.");
        await addClue(drawerClueID);
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

// Start (or restart) the lockpicking minigame
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
