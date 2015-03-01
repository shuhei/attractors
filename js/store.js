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
  store.params = Object.keys(defaults).reduce((acc, name) => {
    acc[name] = normalize(defaults[name]);
    return acc;
  }, {});
  store.useColor = Object.keys(defaults).reduce((acc, name) => {
    acc[name] = false;
    return acc;
  }, {});
  store.useColor.a = true;
  notify();
}

function setParam(name, value) {
  store.params[name] = value;
  notify();
}

function setUseColor(name, value) {
  store.useColor[name] = value;
  notify();
}

function randomizeParams() {
  var amplitude = 3;
  store.params = Object.keys(store.params).reduce((acc, name) => {
    var value = Math.random() * amplitude * 2 - amplitude;
    acc[name] = normalize(value);
    return acc;
  }, {});
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
