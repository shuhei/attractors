'use strict';

module.exports = calc;

// TODO: Figure out better parameters.
calc.defaults = {
  a: 0.484,
  b: -2.169,
  c: -0.722,
  d: -1.305,
  e: -2.106
};

// Pickover
// https://softologyblog.wordpress.com/2009/10/19/3d-strange-attractors/
function calc(vertices, iterations, params) {
  var a = params.a;
  var b = params.b;
  var c = params.c;
  var d = params.d;
  var e = params.e;

  var x = 0.1;
  var y = 0.1;
  var z = 0.1;

  var xNew;
  var yNew;
  var zNew;
  var i;

  for (i = 0; i < 100; i++) {
    xNew = Math.sin(a * x) - z * Math.cos(b * x);
    yNew = z * Math.sin(c * x) - Math.cos(d * y);
    zNew = e * Math.sin(x)
    x = xNew;
    y = yNew;
    z = zNew;
  }

  for (i = 0; i < iterations; i++) {
    xNew = Math.sin(a * x) - z * Math.cos(b * x);
    yNew = z * Math.sin(c * x) - Math.cos(d * y);
    zNew = e * Math.sin(x)
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

