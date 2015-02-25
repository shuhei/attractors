var attractors = require('./attractor');

var store = {
  // Data
  attractor: null,
  params: null,

  // Event
  onUpdate: onUpdate,

  // Actions
  setAttractor: setAttractor,
  setParam: setParam,
  randomizeParams: randomizeParams
};
module.exports = store;

var listeners = [];

function onUpdate(listener) {
  listeners.push(listener);
}

function setAttractor(attractor) {
  store.attractor = attractor;
  var defaults = attractors[attractor].defaults;
  store.params = Object.keys(defaults).reduce(function(acc, name) {
    acc[name] = normalize(defaults[name]);
    return acc;
  }, {});
  notify();
}

function setParam(name, value) {
  store.params[name] = value;
  notify();
}

function randomizeParams() {
  var amplitude = 3;
  store.params = Object.keys(store.params).reduce(function(acc, name) {
    var value = Math.random() * amplitude * 2 - amplitude;
    acc[name] = normalize(value);
    return acc;
  }, {});
  notify();
}


function notify() {
  listeners.forEach(function(listener) {
    listener();
  });
}

function normalize(value) {
  return Math.floor(value * 1000) / 1000;
}
