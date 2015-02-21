module.exports = calc;

// TODO: Figure out better parameters.
calc.defaults = {
  a: -0.966918,
  b: 2.879879,
  c: 0.966918,
  d: 1.765145,
  e: 0.744728,
  f: 0.765145
};

// The king's dream
// http://nathanselikoff.com/training/tutorial-strange-attractors-in-c-and-opengl
function calc(vertices, iterations, params) {
  var a = params.a;
  var b = params.b;
  var c = params.c;
  var d = params.e;
  var e = params.d;
  var f = params.f;

  var x = 0.1;
  var y = 0.1;
  var z = 0.1;

  var xNew;
  var yNew;
  var i;

  var h;
  var colorX;
  var r;
  var g;
  var b;

  for (i = 0; i < 100; i++) {
    xNew = Math.sin(z * c) + f * Math.sin(x * c);
    yNew = Math.sin(x * a) + d * Math.sin(y * a);
    zNew = Math.sin(y * b) + e * Math.sin(z * b);
    x = xNew;
    y = yNew;
    z = zNew;
  }
  for (i = 0; i < iterations; i++) {
    xNew = Math.sin(z * c) + f * Math.sin(x * c);
    yNew = Math.sin(x * a) + d * Math.sin(y * a);
    zNew = Math.sin(y * b) + e * Math.sin(z * b);
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
