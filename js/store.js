var store = {
  // Data
  attractor: null,
  params: null,

  // Event
  onUpdate: onUpdate,

  // Actions
  setAttractor: setAttractor,
  setParams: setParams,
  randomizeParams: randomizeParams
};
module.exports = store;

var listeners = [];

function onUpdate(listener) {
  listeners.push(listener);
}

function setAttractor(attractor) {
  store.attractor = attractor;
  notify();
}

function setParams(params) {
  store.params = params;
  notify();
}

function randomizeParams() {
  var amplitude = 3;
  // TODO: Get param names from attractor.
  var newParams = ['a', 'b', 'c', 'd', 'e', 'f'].reduce(function(acc, name) {
    acc[name] = Math.random() * amplitude * 2 - amplitude;
    return acc;
  }, {});

  setParams(newParams);
}


function notify() {
  listeners.forEach(function(listener) {
    listener();
  });
}
