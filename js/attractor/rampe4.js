'use strict';

module.exports = calc;

// TODO: Figure out better parameters.
calc.defaults = [
  1.5,
  -3.5,
  -0.765145
];

// Rampe4
// https://softologyblog.wordpress.com/2009/10/19/3d-strange-attractors/
function calc(vertices, iterations, params, useColor) {
  var p = params.slice();

  var x = 0.1;
  var y = 0.1;
  var z = 0.1;

  var xNew;
  var yNew;
  var zNew;
  var i;
  var j;

  for (i = 0; i < 100; i++) {
    xNew = z * Math.sin(p[0] * x) + Math.cos(p[0] * y);
    yNew = x * Math.sin(p[1] * y) + Math.cos(p[1] * z);
    zNew = y * Math.sin(p[2] * z) + Math.cos(p[2] * x);
    x = xNew;
    y = yNew;
    z = zNew;
  }

  for (i = 0; i < iterations; i++) {
    xNew = z * Math.sin(p[0] * x) + Math.cos(p[0] * y);
    yNew = x * Math.sin(p[1] * y) + Math.cos(p[1] * z);
    zNew = y * Math.sin(p[2] * z) + Math.cos(p[2] * x);
    x = xNew;
    y = yNew;
    z = zNew;

    vertices[i * 6] = x;
    vertices[i * 6 + 1] = y;
    vertices[i * 6 + 2] = z;

    // Glitch
    for (j = 0; j < useColor.length; j++) {
      if (useColor[j]) {
        p[j] = vertices[i * 6 + 5];
      }
    }
  }

  return vertices;
}