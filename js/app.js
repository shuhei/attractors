import mat from 'gl-mat4';
import createProgram from './shader';
import addColor from './add-color';

module.exports = {
  init: init,
  draw: draw,
  update: update
};

const ITERATIONS = 100000;
const ROTATION_TIME = 100000;
const ATTRIBUTE_NAMES = ['position', 'color'];
const UNIFORM_NAMES = ['mvp', 'alpha'];

var program;
var buffer;
var vertices;
var mvp = mat.create();
var viewTranslate = [0, 0, 0];

function init(gl) {
  // Create shaders and program.
  const vertSrc = getScript('shader-vert');
  const fragSrc = getScript('shader-frag');
  program = createProgram(gl, vertSrc, fragSrc, UNIFORM_NAMES, ATTRIBUTE_NAMES);

  // Create buffer.
  buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.enableVertexAttribArray(program.attributes.position);
  gl.vertexAttribPointer(program.attributes.position, 3, gl.FLOAT, false, 24, 0);
  gl.enableVertexAttribArray(program.attributes.color);
  gl.vertexAttribPointer(program.attributes.color, 3, gl.FLOAT, false, 24, 12);

  // Calc vertices.
  vertices = new Float32Array(ITERATIONS * 6);
  addColor(vertices, ITERATIONS);
}

function update(gl, attractor, params, useColor) {
  attractor(vertices, ITERATIONS, params, useColor);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
}

function draw(gl, t, rotation, distance) {
  const w = gl.drawingBufferWidth;
  const h = gl.drawingBufferHeight;
  gl.viewport(0, 0, w, h);
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.useProgram(program.program);

  viewTranslate[2] = -distance;

  const theta = (t % ROTATION_TIME) / ROTATION_TIME * Math.PI * 2;
  mat.identity(mvp);

  // Perspective
  mat.perspective(mvp, Math.PI / 4, w / h, 0.1, 50);

  // Model View
  mat.translate(mvp, mvp, viewTranslate);
  mat.rotateY(mvp, mvp, rotation.x + theta);
  mat.rotateX(mvp, mvp, rotation.y + theta);

  gl.uniformMatrix4fv(program.uniforms.mvp, false, mvp);
  gl.uniform1f(program.uniforms.alpha, 0.2 / (distance / 6));

  gl.enable(gl.BLEND);
  gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA, gl.ONE)
  gl.blendEquationSeparate(gl.FUNC_ADD, gl.FUNC_ADD)

  // TODO: Smooth point?
  gl.drawArrays(gl.POINTS, 0, ITERATIONS);
}

function getScript(id) {
  const script = document.getElementById(id);
  return script.innerText;
}
