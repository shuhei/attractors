module.exports = calc;

// TODO: Figure out better parameters.
calc.defaults = {
  a: 1.5,
  b: -3.5,
  c: -0.765145,
  d: -0.744728,
  e: -2.5,
  f: -1.83
};

// Rampe4
// https://softologyblog.wordpress.com/2009/10/19/3d-strange-attractors/
function calc(vertices, iterations, params) {
  var a = params.a;
  var b = params.b;
  var c = params.c;
  var d = params.d;
  var e = params.e;
  var f = params.f;

  var x = 0.1;
  var y = 0.1;
  var z = 0.1;

  var xNew;
  var yNew;
  var zNew;
  var i;

  var h;
  var colorX;
  var r;
  var g;
  var b;

  for (i = 0; i < 100; i++) {
    xNew = x * Math.sin(a * x) + Math.cos(b * y);
    yNew = y * Math.sin(c * y) + Math.cos(d * z);
    zNew = z * Math.sin(e * z) + Math.cos(f * x);
    x = xNew;
    y = yNew;
    z = zNew;
  }
  for (i = 0; i < iterations; i++) {
    xNew = x * Math.sin(a * x) + Math.cos(b * y);
    yNew = y * Math.sin(c * y) + Math.cos(d * z);
    zNew = z * Math.sin(e * z) + Math.cos(f * x);
    x = xNew;
    y = yNew;
    z = zNew;

    h = 6 * i / iterations;
    colorX = 1 - Math.abs(h % 2 - 1)
    if (h < 1) {
    } else if (1 <= h && h < 2) {
      r = 1;
      g = colorX;
      b = 0;
    } else if (2 <= h && h < 3) {
      r = colorX;
      g = 1;
      b = 0;
    } else if (3 <= h && h < 4) {
      r = 0;
      g = 1;
      b = colorX;
    } else if (4 <= h && h < 5) {
      r = 0;
      g = colorX;
      b = 1;
    } else if (5 <= h) {
      r = 1;
      g = 0;
      b = colorX;
    }

    vertices[i * 6] = x;
    vertices[i * 6 + 1] = y;
    vertices[i * 6 + 2] = z;
    vertices[i * 6 + 3] = r;
    vertices[i * 6 + 4] = g;
    vertices[i * 6 + 5] = b;
  }
  return vertices;
}
