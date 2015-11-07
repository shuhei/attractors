import qs from 'querystring';
import React from 'react';
import app from './app';
import fit from './lib/fit';
import control from './lib/control';
import attractors from './attractor';
import store from './store';
import { Form } from './components/form';

const INITIAL_ATTRACTOR = 'kingsDream';

// Store.
if (window.location.search) {
  const state = qs.parse(window.location.search.slice(1));
  store.setState(state);
} else {
  store.setAttractor(INITIAL_ATTRACTOR);
}

store.onUpdate(update);

window.addEventListener('popstate', (e) => {
  if (e.state) {
    store.setState(e.state);
  }
}, false);

React.render(
  <Form />,
  document.getElementById('form')
);

// Canvas.
const INITIAL_DISTANCE = 6;
const canvas = document.createElement('canvas');
document.body.appendChild(canvas);
fit(canvas);
const getStates = control(canvas, INITIAL_DISTANCE);

canvas.addEventListener('webglcontextlost', function(e) {
  console.log('context lost', e);
  e.preventDefault();
}, false);

canvas.addEventListener('webglcontextrestores', function(e) {
  console.log('context restored', e);
}, false);

// GL.
const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
app.init(gl);
update();
draw();

function update() {
  const state = store.serialize();
  const query = `?${qs.stringify(state)}`;
  if (window.location.search !== query) {
    window.history.pushState(state, query.slice(1), query);
  }

  const attractor = attractors[store.attractor];
  app.update(gl, attractor, store.params, store.useColor);
}

function draw() {
  const states = getStates();
  app.draw(gl, Date.now(), states.rotation, states.distance);
  requestAnimationFrame(draw);
}
