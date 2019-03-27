//A slightly different version of snake known as snek
//Somewhat inspired by slither.io, but it looks quite different so
//I(Tejas Hegde)'ll take 90% credit the other 10% being split between processing and slither.io 9:1
//Was initialy in java, but converted it into js so I could put it onto a website

var snekColor;
var snekHeadColor;
var collisionColor;

var snekSize = 10.0;

var snek=[];
var foods=[];
//a frame counter
var c = 0;
//used to zoom in and out
var zoom = 1.0;
var prevZoom = 1.0;

//death timer
var timer = -1.0;

var scaleAmount = 1.0;
//is this the first time opening the game?
var started = false;
var ded = 1;

function sqrMagnitude(x, y){
  return x*x + y*y;
}

//checks if rect1 contains rect2
function rectInside(x1, y1, w1, h1, x2, y2, w2, h2){
  if(pointInside(x2, y2,x1,y1,w1,h1)){
    return true;      
  }
  if(pointInside(x2+w2, y2, x1,y1,w1,h1)){
    return true;
  }
  if(pointInside(x2, y2 + h2, x1,y1,w1,h1)){
    return true;
  }
  if(pointInside(x2+w2, y2+h2, x1,y1,w1,h1)){
    return true;
  }
  return false;
}
//checks if rect1 and rect2 intersect
function intersect(x1, y1, w1, h1, x2, y2, w2, h2){
  if(rectInside(x1,y1,w1,h1,x2,y2,w2,h2)){
    return true;
  }
  
  if(rectInside(x2,y2,w2,h2,x1,y1,w1,h1)){
    return true;
  }
  return false;
}

//generates a random hue from a hue on the hsv wheel
function randomHue(){
  var d = random(0,360);
  var X = 1 - abs((d/60 % 2) - 1);
  if(d < 60){
    return color(255,255*X,0);
  } else if(d < 120){
    return color(255*X,255,0);
  }else if(d < 180){
    return color(0,255,255*X);
  }else if(d < 240){
    return color(0,255*X,255);
  }else if(d < 300){
    return color(255*X,0,255);
  }else{
    return color(255,0,255*X);
  }
}

function pointInside(px, py, x, y, w, h){
  if(px > x){
    if(px < x + w){
      if(py > y){
        if(py < y + h){
          return true;
        }
      }    
    }
  }
  return false;
}

function Point(x,y){
	this.x=x;
	this.y=y;
}

function Food(x,y,w,h,c){
	this.x=x;
	this.y=y;
	this.h=h;
	this.w=w;
	this.col=c;
}

function reset(){
  if(timer < 0){
	started = true;
	foods = [];
	snek = [];
	c = 0;
	timer = 30*60;
	zoom = 1;
	prevZoom = 1;
	scaleAmount = 1;
	ded = 1;

	for(var i = 0;  i < 10; i++){
	snek.push(new Point(mouseX + i* snekSize * 2,mouseY));
	}
  }
}

function keyPressed(){
  if(key==='f'){
    reset();
  }
}

function mousePressed(){
  reset();
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  //need this to not 'seg fault' at the start
  snek.push(new Point(windowWidth/2, windowHeight/2));
  snek.push(new Point(windowWidth/2+snekSize, windowHeight/2));
  //frameRate(60);
  snekColor = color(255);
  snekHeadColor = color(0,0,255);
  collisionColor = color(255,0,0);
  windowResized();
  noStroke();
}

function drawSnek(){
  fill(snekColor);
  for(var i = 0;i < snek.length; i++){
    var p = snek[i];
    rect(p.x,p.y,snekSize,snekSize);
	//text(i,p.x,p.y);
  }
  fill(snekHeadColor);
  rect(snek[0].x,snek[0].y,10,10);
}

function drawFood(){
  fill(randomHue());
  for(var i = 0; i < foods.length; i++){
    var f = foods[i];
    fill(f.col);
    rect(f.x, f.y, f.w, f.h);
  }
}

function growSnek(num){
  if(snek.length>=1000){return;}
  var p = snek[snek.length-1];
  for(var i = 0; i < num;i++){
    snek.push(new Point(p.x, p.y));
  }
}

function crossHair(x, y, r1, r2){
  line(x-r1,y-r1,x-r2,y-r2);
  line(x+r1,y+r1,x+r2,y+r2);
  line(x+r1,y-r1,x+r2,y-r2);
  line(x-r1,y+r1,x-r2,y+r2);
}

function draw() {
  background(0);
  
  //view and drawing logic
  prevZoom = lerp(prevZoom,zoom,0.1);
  textAlign(LEFT);
  text("Score = Length = " + str(snek.length) + " | Time Left: " + nf(timer,0,2),10,10);

  scaleAmount =1/prevZoom; 
  scale(scaleAmount);
  
  //draw game
  stroke(snekHeadColor);
  crossHair(mouseX,mouseY,snekSize,2*snekSize,p5);
  noStroke();
  
  drawSnek();
  drawFood();
  
  //collide the head with every other snake segment and draw collision  
  var head = snek[0];
  for(var i = 3; i < snek.length; i++){
    var segment = snek[i];
    if(intersect(head.x,head.y,snekSize,snekSize,segment.x, segment.y, snekSize, snekSize)){
      fill(collisionColor);
      stroke(collisionColor);
      strokeWeight(2);
      crossHair(segment.x+snekSize/2,segment.y+snekSize/2,snekSize,snekSize*3,p5);
	  noStroke();
      strokeWeight(1);
      rect(segment.x,segment.y,snekSize,snekSize);
      timer = -1;
      ded = 0;
    }
  }  
  
    //Game logic
  if(timer < 0){
    fill(255,0,0);
    textAlign(CENTER);
    textSize(32);
    if(!started){
      text("Welcome to SNEK!\n [F] to start, \n Mouse to control",windowWidth/2,windowHeight/2);
    } else {
      if(ded===1){
        text("You died of humger!! so sad :(\n[F] to pay respects (and restart)", windowWidth/2,windowHeight/2);
      } else {
        text("You ate urself! How unfortunate\n[F] to pay respects (and restart)", windowWidth/2,windowHeight/2);
      }
    }
    textSize(12);
  }  else {
    //Control snake, make it move towards the mouse
	
	var mouseXPos = zoom * mouseX;
	var mouseYPos = zoom * mouseY;
	
    var xDelta = (mouseXPos-snekSize/2) - snek[0].x;
    var yDelta = (mouseYPos-snekSize/2) - snek[0].y;
	console.log(snekSize);
    var mag = sqrt(sqrMagnitude(xDelta,yDelta));
    if(mag < snekSize){
      //do nothing for now
    } else {
      xDelta/=mag; yDelta/=mag;
      //move the segment from the back of the snake to the front of the snake in the direction of the mouse
	  //propagate xy to the end of the list, basically deleting the last one
	  for(var i = snek.length-1; i>0;i--){
		console.log(i);
		snek[i].x=snek[i-1].x;
		snek[i].y=snek[i-1].y;
	  }
	  var newHead = snek[0];
	  newHead.x += xDelta*snekSize;
	  newHead.y += yDelta*snekSize;
    }
    
    timer --;
    
    //Add a new food every 120 frames, or 2 seconds
    if(c > 60){
      var w = random(2,40) * zoom;
      var h = random(2,40) * zoom;
      var x = random(zoom*windowWidth-w);
      var y = random(zoom*windowHeight-h);
      foods.push(new Food(x,y,w,h,randomHue()));
      c = 0;
    } else {
      c++;
    }
      
    //collide every snake element with every food
    var n = snek.length; //cache n since it's changing
    for(var i = 0; i < n; i++){
      var p = snek[i];
      for(var j = 0; j < foods.length; j++){
        var f = foods[j];
        if(intersect(p.x,p.y,snekSize,snekSize,f.x,f.y,f.w,f.h)){
          foods.splice(j,1);
          growSnek(ceil((f.w*f.h)/(snekSize*snekSize)));
          timer += 1.0 * 60;
          j--;
        }
      }
    }
  }
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
  background(0);
}


