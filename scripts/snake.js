class Snake {
  constructor(bodyColour, headColour, bodySize) {
    this.colour = bodyColour;
    this.headColour = headColour;
    this.bodySize = bodySize;

    this.body = [];
    this.head = 0;
    this.numToAdd = 0;
    this.isCollidingWithSelf = false;

    this.reset();
  }

  getSegmentIndex(numFromHead) {
    return (this.head + numFromHead) % this.body.length;
  }

  getSegment(numFromHead) {
    return this.body[this.getSegmentIndex(numFromHead)];
  }

  queueNewSegments(num) {
    this.numToAdd += num;
  }

  pushSegment() {
    if (this.numToAdd <= 0) return;

    this.numToAdd--;

    var index = this.getSegmentIndex(1);

    this.body.splice(
      index,
      0,
      new Point(this.body[index].x, this.body[index].y)
    );

    if (index < this.head) {
      this.head++;
    }
  }

  draw() {
    fill(this.colour);
    noStroke();

    for (var i = 0; i < this.body.length; i++) {
      var p = this.body[i];

      var amountAlongLength =
        this.getSegmentIndex(this.body.length - i) / this.body.length;
      fill(amountAlongLength * 155 + 100);

      rect(p.x, p.y, this.bodySize, this.bodySize);
    }

    fill(this.headColour);

    var headSegment = this.body[this.getSegmentIndex(0)];
    rect(headSegment.x, headSegment.y, this.bodySize, this.bodySize);

    this.drawSelfCollisions();
  }

  drawSelfCollisions() {
    var head = this.getSegment(0);
    for (var i = 5; i < this.body.length; i++) {
      var segment = this.getSegment(i);
      if (
        intersect(
          head.x,
          head.y,
          this.bodySize,
          this.bodySize,
          segment.x,
          segment.y,
          this.bodySize,
          this.bodySize
        )
      ) {
        fill(this.headColour);
        stroke(this.headColour);
        strokeWeight(2);

        crossHair(
          segment.x + this.bodySize / 2,
          segment.y + this.bodySize / 2,
          this.bodySize,
          this.bodySize * 3,
          this.headColour
        );

        noStroke();
        strokeWeight(1);

        rect(segment.x, segment.y, this.bodySize, this.bodySize);

        this.isCollidingWithSelf = true;
      }
    }
  }

  isColliding(){
    return this.isCollidingWithSelf;
  }

  length() {
    return this.body.length;
  }

  reset() {
    this.body = [];
    this.head = 0;
    this.numToAdd = 0;
    this.isCollidingWithSelf = false;

    for (var i = 0; i < 10; i++) {
      this.body.push(
        new Point(windowWidth / 2 + i * this.bodySize * 2, windowHeight / 2)
      );
    }
  }

  moveTowards(x, y) {
    var xDelta = x - this.bodySize / 2 - this.getSegment(0).x;
    var yDelta = y - this.bodySize / 2 - this.getSegment(0).y;

    var mag = sqrt(sqrMagnitude(xDelta, yDelta));
    if (mag < this.bodySize) {
      //do nothing for now
    } else {
      xDelta /= mag;
      yDelta /= mag;

      //Instead, make the new this.head the last element
      var oldHead = this.body[this.head];
      this.head = this.getSegmentIndex(this.body.length - 1);
      var newHead = this.body[this.head];
      newHead.x = oldHead.x + xDelta * this.bodySize;
      newHead.y = oldHead.y + yDelta * this.bodySize;

      //add a segment to the snake if there are any left to add
      this.pushSegment();
    }
  }

  eatFood(foods) {
    //collide every snake element with every food
    var n = this.body.length; //cache n since it's changing
    for (var i = 0; i < n; i++) {
      var p = this.body[i];
      for (var j = 0; j < foods.length; j++) {
        var f = foods[j];
        if (
          intersect(p.x, p.y, this.bodySize, this.bodySize, f.x, f.y, f.w, f.h)
        ) {
          //Delete the food that we just intersected with
          foods[j] = foods[foods.length - 1];
          foods.pop();

          let amount = ceil(f.nutrition() / (this.bodySize * this.bodySize));
          this.queueNewSegments(amount);
          timer += amount * 10;
          j--;
        }
      }
    }
  }
}
