//generates a random hue from a hue on the hsv wheel
function randomHue() {
  var d = random(0, 360);
  var X = 1 - abs(((d / 60) % 2) - 1);
  if (d < 60) {
    return color(255, 255 * X, 0);
  } else if (d < 120) {
    return color(255 * X, 255, 0);
  } else if (d < 180) {
    return color(0, 255, 255 * X);
  } else if (d < 240) {
    return color(0, 255 * X, 255);
  } else if (d < 300) {
    return color(255 * X, 0, 255);
  } else {
    return color(255, 0, 255 * X);
  }
}

function crossHair(x, y, r1, r2, col) {
  stroke(col);
  line(x - r1, y - r1, x - r2, y - r2);
  line(x + r1, y + r1, x + r2, y + r2);
  line(x + r1, y - r1, x + r2, y - r2);
  line(x - r1, y + r1, x - r2, y + r2);
}
