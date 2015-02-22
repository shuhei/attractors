'use strict';

module.exports = calc;

// TODO: Figure out better parameters.
calc.defaults = {
  a: 1.5,
  b: -3.5,
  c: -0.765145
};

// Rampe8
// https://softologyblog.wordpress.com/2009/10/19/3d-strange-attractors/
function calc(vertices, iterations, params) {
  var a = params.a;
  var b = params.b;
  var c = params.c;

  var x = 0.1;
  var y = 0.1;
  var z = 0.1;

  var xNew;
  var yNew;
  var zNew;
  var i;

  for (i = 0; i < 100; i++) {
    xNew = z * Math.sin(a * x) - Math.cos(y);
    yNew = x * Math.cos(b * y) + Math.sin(z);
    zNew = y * Math.sin(c * z) - Math.cos(x);
    x = xNew;
    y = yNew;
    z = zNew;
  }

  for (i = 0; i < iterations; i++) {
    xNew = z * Math.sin(a * x) - Math.cos(y);
    yNew = x * Math.cos(b * y) + Math.sin(z);
    zNew = y * Math.sin(c * z) - Math.cos(x);
    x = xNew;
    y = yNew;
    z = zNew;

    vertices[i * 6] = x;
    vertices[i * 6 + 1] = y;
    vertices[i * 6 + 2] = z;

    // Glitch
    // a = vertices[i * 6 + 5];
    // b = vertices[i * 6 + 5];
  }

  return vertices;
}
