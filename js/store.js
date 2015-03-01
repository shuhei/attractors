var attractors = require('./attractor');

var store = {
  // Data
  attractor: null,
  params: null,
  useColor: null,

  // Event
  onUpdate: onUpdate,

  // Actions
  setAttractor: setAttractor,
  setParam: setParam,
  setUseColor: setUseColor,
  randomizeParams: randomizeParams
};
export default store;

var listeners = [];

function onUpdate(listener) {
  listeners.push(listener);
}

function setAttractor(attractor) {
  store.attractor = attractor;
  var defaults = attractors[attractor].defaults;
  store.params = defaults.map(normalize);
  store.useColor = defaults.map(() => false);
  store.useColor[0] = true;
  notify();
}

function setParam(index, value) {
  store.params[index] = value;
  notify();
}

function setUseColor(index, value) {
  store.useColor[index] = value;
  notify();
}

function randomizeParams() {
  var amplitude = 3;
  store.params = store.params.map(() => {
    var value = Math.random() * amplitude * 2 - amplitude;
    return normalize(value);
  });
  notify();
}


function notify() {
  listeners.forEach((listener) => {
    listener();
  });
}

function normalize(value) {
  return Math.floor(value * 1000) / 1000;
}
