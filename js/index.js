var app = require('./app');
var fit = require('./fit');
var form = require('./form');
var control = require('./control');
var attractors = require('./attractor');

var INITIAL_DISTANCE = 6;
var DEFAULT_ATTRACTOR = 'rampe4';

var canvas = document.createElement('canvas');
document.body.appendChild(canvas);
fit(canvas);
var getStates = control(canvas, INITIAL_DISTANCE);

form.set(DEFAULT_ATTRACTOR, attractors[DEFAULT_ATTRACTOR].defaults);
console.log(form.data);

canvas.addEventListener('webglcontextlost', function(e) {
  console.log('context lost', e);
  e.preventDefault();
}, false);

canvas.addEventListener('webglcontextrestores', function(e) {
  console.log('context restored', e);
}, false);

var gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
app.init(gl);
update();
draw();

form.onUpdate(update);

function update() {
  var data = form.data;
  var attractor = attractors[data.attractor];
  var args = [gl, attractor].concat(data.params);
  app.update.apply(null, args);
}

function draw() {
  var states = getStates();
  app.draw(gl, Date.now(), states.rotation, states.distance);
  requestAnimationFrame(draw);
}
