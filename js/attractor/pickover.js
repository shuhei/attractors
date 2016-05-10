// TODO: Figure out better parameters.
export const defaults = [
  0.484,
  -2.169,
  -0.722,
  -1.305,
  -2.106,
];

// Pickover
// https://softologyblog.wordpress.com/2009/10/19/3d-strange-attractors/
export function calc(vertices, iterations, params, useColor) {
  const p = params.slice();

  let x = 0.1;
  let y = 0.1;
  let z = 0.1;

  let xNew;
  let yNew;
  let zNew;
  let i;
  let j;

  for (i = 0; i < 100; i++) {
    xNew = Math.sin(p[0] * x) - z * Math.cos(p[1] * x);
    yNew = z * Math.sin(p[2] * x) - Math.cos(p[3] * y);
    zNew = p[4] * Math.sin(x);
    x = xNew;
    y = yNew;
    z = zNew;
  }

  for (i = 0; i < iterations; i++) {
    xNew = Math.sin(p[0] * x) - z * Math.cos(p[1] * x);
    yNew = z * Math.sin(p[2] * x) - Math.cos(p[3] * y);
    zNew = p[4] * Math.sin(x);
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
