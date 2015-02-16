module.exports = calc;

// TODO: Figure out better parameters.
calc.defaults = [
  -0.966918,
  2.879879,
  0.966918,
  1.765145,
  0.744728,
  0.765145
];

// The king's dream
// http://nathanselikoff.com/training/tutorial-strange-attractors-in-c-and-opengl
function calc(vertices, iterations, a, b, c, d, e, f) {
  var x = 0.1;
  var y = 0.1;
  var z = 0.1;

  var xNew;
  var yNew;
  var i;

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
    vertices[i * 3] = x;
    vertices[i * 3 + 1] = y;
    vertices[i * 3 + 2] = z;
  }
  return vertices;
}
