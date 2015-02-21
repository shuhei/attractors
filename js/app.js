var mat = require('gl-mat4');
var createProgram = require('./shader');

module.exports = {
  init: init,
  draw: draw,
  update: update
};

var ITERATIONS = 100000;
var ROTATION_TIME = 100000;

var program;
var buffer;
var vertices;
var mvp = mat.create();
var viewTranslate = [0, 0, 0];

function init(gl) {
  // Create shaders and program.
  var vertSrc = getScript('shader-vert');
  var fragSrc = getScript('shader-frag');
  var attributeNames = ['position'];
  var uniformNames = ['mvp', 'alpha'];
  program = createProgram(gl, vertSrc, fragSrc, uniformNames, attributeNames);

  // Create buffer.
  buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.enableVertexAttribArray(program.attributes.position);
  gl.vertexAttribPointer(program.attributes.position, 3, gl.FLOAT, false, 0, 0);

  // Calc vertices.
  vertices = new Float32Array(ITERATIONS * 3);
}

function update(gl, attractor, params) {
  attractor(vertices, ITERATIONS, params);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
}

function draw(gl, t, rotation, distance) {
  var w = gl.drawingBufferWidth;
  var h = gl.drawingBufferHeight;
  gl.viewport(0, 0, w, h);
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.useProgram(program.program);

  viewTranslate[2] = -distance;

  var theta = (t % ROTATION_TIME) / ROTATION_TIME * Math.PI * 2;
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
  var script = document.getElementById(id);
  return script.innerText;
}
