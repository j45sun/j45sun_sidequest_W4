/*
Week 4 — Example 5: Example 5: Blob Platformer (JSON + Classes)
Course: GBDA302
Instructors: Dr. Karen Cochrane and David Han
Date: Feb. 5, 2026

This file orchestrates everything:
- load JSON in preload()
- create WorldLevel from JSON
- create BlobPlayer
- update + draw each frame
- handle input events (jump, optional next level)

This matches the structure of the original blob sketch from Week 2 but moves
details into classes.
*/

let data; // raw JSON data
let levelIndex = 0;

let world; // WorldLevel instance (current level)
let player; // BlobPlayer instance

let gameState = "play";

function preload() {
  // Load the level data from disk before setup runs.
  data = loadJSON("levels.json");
}

function setup() {
  // Create the player once (it will be respawned per level).
  player = new BlobPlayer();

  // Load the first level.
  loadLevel(0);

  // Simple shared style setup.
  noStroke();
  textFont("sans-serif");
  textSize(14);
}

function draw() {
  // Check game state. If we're on the end screen, draw it and skip the rest of the loop.
  if (gameState === "end") {
    drawEndScreen();
    return;
  }

  world.drawWorld();

  player.update(world.platforms, world.obstacles);

  player.draw(world.theme.blob);

  if (world.goal && world.goal.isCollectedBy(player)) {
    if (levelIndex === data.levels.length - 1) {
      gameState = "end";
    } else {
      loadLevel(levelIndex + 1);
    }
  }

  fill(0);
  textAlign(LEFT, TOP);
  text(world.name, 10, 18);
}

function keyPressed() {
  // Jump keys
  if (key === " " || key === "W" || key === "w" || keyCode === UP_ARROW) {
    player.jump();
  }

  // Optional: cycle levels with N (as with the earlier examples)
  if (key === "n" || key === "N") {
    const next = (levelIndex + 1) % data.levels.length;
    loadLevel(next);
  }
}

// end screen
function drawEndScreen() {
  background(250, 243, 221);

  fill(0);
  textAlign(CENTER, CENTER);
  textSize(32);
  text("You Win!", width / 2, height / 2 - 60);

  drawReplayButton();
}

// replay button
function drawReplayButton() {
  const bw = 160;
  const bh = 50;
  const bx = width / 2 - bw / 2;
  const by = height / 2;

  // button background
  fill(255, 166, 158);
  rect(bx, by, bw, bh, 8);

  // button text
  fill(0);
  textSize(20);
  text("Replay", width / 2, by + bh / 2);
}

// press button function
function mousePressed() {
  if (gameState !== "end") return;

  const bw = 160;
  const bh = 50;
  const bx = width / 2 - bw / 2;
  const by = height / 2;

  if (mouseX > bx && mouseX < bx + bw && mouseY > by && mouseY < by + bh) {
    restartGame();
  }
}

// restart game function
function restartGame() {
  gameState = "play";
  levelIndex = 0;
  loadLevel(0);
}

/*
Load a level by index:
- create a WorldLevel instance from JSON
- resize canvas based on inferred geometry
- spawn player using level start + physics
*/
function loadLevel(i) {
  levelIndex = i;

  // Create the world object from the JSON level object.
  world = new WorldLevel(data.levels[levelIndex]);

  // Fit canvas to world geometry (or defaults if needed).
  const W = world.inferWidth(640);
  const H = world.inferHeight(360);
  resizeCanvas(W, H);

  // Apply level settings + respawn.
  player.spawnFromLevel(world);
}
