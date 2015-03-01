'use strict';

module.exports = calc;

// TODO: Figure out better parameters.
calc.defaults = [
  -0.966918,
  2.879879,
  0.966918,
  0.736,
  0.744728,
  0.765145
];

// The king's dream
// http://nathanselikoff.com/training/tutorial-strange-attractors-in-c-and-opengl
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
    xNew = Math.sin(z * p[2]) + p[5] * Math.sin(x * p[2]);
    yNew = Math.sin(x * p[0]) + p[3] * Math.sin(y * p[0]);
    zNew = Math.sin(y * p[1]) + p[4] * Math.sin(z * p[1]);
    x = xNew;
    y = yNew;
    z = zNew;
  }

  for (i = 0; i < iterations; i++) {
    xNew = Math.sin(z * p[2]) + p[5] * Math.sin(x * p[2]);
    yNew = Math.sin(x * p[0]) + p[3] * Math.sin(y * p[0]);
    zNew = Math.sin(y * p[1]) + p[4] * Math.sin(z * p[1]);
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
