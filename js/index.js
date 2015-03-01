import app from './app';
import fit from './fit';
import control from './control';
import attractors from './attractor';
import React from 'react';
import store from './store';
import { Form } from './components/form';

// Store.
var INITIAL_ATTRACTOR = 'kingsDream';
store.setAttractor(INITIAL_ATTRACTOR);
store.onUpdate(update);

React.render(
  <Form />,
  document.getElementById('form')
);

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
  app.update(gl, attractor, store.params, store.useColor);
}

function draw() {
  var states = getStates();
  app.draw(gl, Date.now(), states.rotation, states.distance);
  requestAnimationFrame(draw);
}
