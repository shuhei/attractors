module.exports = calc;

// TODO: Figure out better parameters.
calc.defaults = [
  1.5,
  -3.5,
  -0.765145,
  -0.744728,
  -2.5,
  -1.83
];

// Rampe4
// https://softologyblog.wordpress.com/2009/10/19/3d-strange-attractors/
function calc(vertices, iterations, a, b, c, d, e, f) {
  var x = 0.1;
  var y = 0.1;
  var z = 0.1;

  var xNew;
  var yNew;
  var zNew;
  var i;
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
    vertices[i * 3] = x;
    vertices[i * 3 + 1] = y;
    vertices[i * 3 + 2] = z;
  }
  return vertices;
}
