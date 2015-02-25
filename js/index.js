var app = require('./app');
var fit = require('./fit');
var control = require('./control');
var attractors = require('./attractor');

// Store.
var INITIAL_ATTRACTOR = 'kingsDream';
var store = require('./store');
store.setAttractor(INITIAL_ATTRACTOR);
store.onUpdate(update);

// TODO: Initialize form.
var form = require('./form');

// Canvas.
var INITIAL_DISTANCE = 6;
var canvas = document.createElement('canvas');
document.body.appendChild(canvas);
fit(canvas);
var getStates = control(canvas, INITIAL_DISTANCE);

canvas.addEventListener('webglcontextlost', function(e) {
  console.log('context lost', e);
  e.preventDefault();
}, false);

canvas.addEventListener('webglcontextrestores', function(e) {
  console.log('context restored', e);
}, false);

// GL.
var gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
app.init(gl);
update();
draw();

function update() {
  var attractor = attractors[store.attractor];
  var args = [gl, attractor].concat(store.params);
  app.update.apply(null, args);
}

function draw() {
  var states = getStates();
  app.draw(gl, Date.now(), states.rotation, states.distance);
  requestAnimationFrame(draw);
}
