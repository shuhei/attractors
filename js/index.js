var app = require('./app');
var fit = require('./fit');
var form = require('./form');
var attractors = require('./attractor');

var canvas = document.createElement('canvas');
document.body.appendChild(canvas);
fit(canvas);

var DEFAULT_ATTRACTOR = 'rampe4';
var args = [DEFAULT_ATTRACTOR].concat(attractors[DEFAULT_ATTRACTOR].defaults);
form.set.apply(form, args);
console.log(form.data);

var gl = canvas.getContext('webgl');
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
  app.draw(gl, Date.now());
  requestAnimationFrame(draw);
}
