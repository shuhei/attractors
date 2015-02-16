var app = require('./app');
var fit = require('./fit');
var form = require('./form');

var canvas = document.createElement('canvas');
document.body.appendChild(canvas);
fit(canvas);

var gl = canvas.getContext('webgl');
app.init(gl);
// update();
draw();

form.onUpdate(update);

function update() {
  var data = form.data;
  var args = [gl, data.attractor].concat(data.params);
  app.update.apply(app, args);
}

function draw() {
  app.draw(gl, Date.now());
  requestAnimationFrame(draw);
}
