function pointInside(px, py, x, y, w, h) {
  if (px > x) {
    if (px < x + w) {
      if (py > y) {
        if (py < y + h) {
          return true;
        }
      }
    }
  }
  return false;
}

function sqrMagnitude(x, y) {
  return x * x + y * y;
}

//checks if rect1 contains rect2
function rectInside(x1, y1, w1, h1, x2, y2, w2, h2) {
  if (pointInside(x2, y2, x1, y1, w1, h1)) {
    return true;
  }
  if (pointInside(x2 + w2, y2, x1, y1, w1, h1)) {
    return true;
  }
  if (pointInside(x2, y2 + h2, x1, y1, w1, h1)) {
    return true;
  }
  if (pointInside(x2 + w2, y2 + h2, x1, y1, w1, h1)) {
    return true;
  }
  return false;
}

//checks if rect1 and rect2 intersect
function intersect(x1, y1, w1, h1, x2, y2, w2, h2) {
  if (rectInside(x1, y1, w1, h1, x2, y2, w2, h2)) {
    return true;
  }

  if (rectInside(x2, y2, w2, h2, x1, y1, w1, h1)) {
    return true;
  }
  return false;
}
