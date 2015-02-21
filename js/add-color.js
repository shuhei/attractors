'use strict';

module.exports = function(vertices, iterations) {
  var h;
  var x;

  var r;
  var g;
  var b;

  var i;

  for (i = 0; i < iterations; i++) {
    // HSL to RGB where S and L are always 1.
    h = 6 * i / iterations;
    x = 1 - Math.abs(h % 2 - 1)
    if (h < 1) {
      r = 1;
      g = x;
      b = 0;
    } else if (1 <= h && h < 2) {
      r = x;
      g = 1;
      b = 0;
    } else if (2 <= h && h < 3) {
      r = 0;
      g = 1;
      b = x;
    } else if (3 <= h && h < 4) {
      r = 0;
      g = x;
      b = 1;
    } else if (4 <= h && h < 5) {
      r = x;
      g = 0;
      b = 1;
    } else if (5 <= h) {
      r = 1;
      g = 0;
      b = x;
    }

    vertices[i * 6 + 3] = r;
    vertices[i * 6 + 4] = g;
    vertices[i * 6 + 5] = b;
  }

  return vertices;
};
