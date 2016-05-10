// TODO: Figure out better parameters.
export const defaults = [
  1.5,
  -3.5,
  -0.765145,
];

// Rampe4
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
