//IDEA: make food go from green to red, with red food being less nutritional
class Food {
  constructor(x, y, w, h, c) {
    this.x = x;
    this.y = y;
    this.h = h;
    this.w = w;
    this.col = c;
  }

  nutrition(){
    return this.w * this.h;
  }
}
