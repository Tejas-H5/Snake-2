var snake;
var foods = [];
var FPS = 60;
var snakeSize = 10;

var textHeight;

//a frame counter
var c = 0;
var zoom = 1.0;
var prevZoom = 1.0;

//death timer
var timer = -1.0;

var scaleAmount = 1.0;
//is this the first time opening the game?
var started = false;
var dead = 1;

function reset() {
  if (timer < 0) {
    snake.reset();
    started = true;
    foods = [];
    c = 0;
    timer = 30 * FPS;
    zoom = 1;
    prevZoom = 1;
    scaleAmount = 1;
    dead = 1;
  }
}

function keyPressed() {
  if (key === "f") {
    reset();
  }
}

function mousePressed() {
  reset();
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(FPS);

  snake = new Snake(color(255), color(0, 0, 255), snakeSize);
  textHeight = windowHeight/20;

  windowResized();
  noStroke();
}

function drawFood() {
  fill(randomHue());
  stroke(255);
  for (var i = 0; i < foods.length; i++) {
    var f = foods[i];
    fill(f.col);
    rect(f.x, f.y, f.w, f.h);
  }
}

function updateZoom() {
  prevZoom = lerp(prevZoom, zoom, 0.1);

  scaleAmount = 1 / prevZoom;
  scale(scaleAmount);
}

function drawStats() {
  textAlign(LEFT);
  fill(color(255, 255, 255));
  textSize(textHeight);
  text(
    "Score = Length = " + str(snake.length()) + " | Time Left: " + nf(timer, 0, 2),
    10,
    textHeight
  );
}

function addFoodIntermittently() {
  //Add a new food every c frames, or c/FPS seconds
  if (c > FPS) {
    var w = random(snakeSize, 40) * zoom;
    var h = random(snakeSize, 40) * zoom;
    var x = random(zoom * windowWidth - w);
    //Don't spawn any food over top of the text
    var y = textHeight + random(zoom * windowHeight - h - textHeight);
    foods.push(new Food(x, y, w, h, randomHue()));
    c = 0;
  } else {
    c++;
  }
}

function updateGame() {
  if (snake.isColliding()) {
    timer = -1;
    dead = 0;
  }

  var mouseXPos = zoom * mouseX;
  var mouseYPos = zoom * mouseY;

  snake.moveTowards(mouseXPos, mouseYPos);

  timer--;

  addFoodIntermittently();

  snake.eatFood(foods);
}


function drawGame() {
  background(0);
  updateZoom();

  drawFood();

  snake.draw();

  crossHair(mouseX, mouseY, snakeSize, 2 * snakeSize, color(255, 0, 0));

  drawStats();
}

function drawDeathMessage() {
  fill(255, 0, 0);
  textAlign(CENTER);
  textSize(32);
  if (!started) {
    text(
      "Click to start.\n" + 
      "Use the mouse to control where the snake goes",
      windowWidth / 2,
      windowHeight / 2
    );
  } else {
    if (dead === 1) {
      text(
        "Your snake died of hunger. Press [F] to pay respects (and restart)",
        windowWidth / 2,
        windowHeight / 2
      );
    } else {
      text(
        "Your snake cannibalized itself. Then died. Press [F] to pay respects (and restart)",
        windowWidth / 2,
        windowHeight / 2
      );
    }
  }
  textSize(12);
}

function draw() {
  drawGame();

  //Game logic
  if (timer < 0) {
    drawDeathMessage();
  } else {
    updateGame();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(0);
}
