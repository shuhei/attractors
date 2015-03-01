var attractors = require('./attractor');

class Store {
  constructor() {
    this.listeners = [];
    this.attractor = null;
    this.params = [];
    this.useColor = [];
  }

  onUpdate(listener) {
    this.listeners.push(listener);
  }

  setAttractor(attractor) {
    this.attractor = attractor;
    var defaults = attractors[attractor].defaults;
    this.params = defaults.map(normalize);
    this.useColor = defaults.map(() => false);
    this.useColor[1] = true;
    this.notify();
  }

  setParam(index, value) {
    this.params[index] = value;
    this.notify();
  }

  setUseColor(index, value) {
    this.useColor[index] = value;
    this.notify();
  }

  randomizeParams() {
    var amplitude = 3;
    this.params = this.params.map(() => {
      var value = Math.random() * amplitude * 2 - amplitude;
      return normalize(value);
    });
    this.notify();
  }

  notify() {
    this.listeners.forEach((listener) => {
      listener();
    });
  }
}

var store = new Store();
export default store;

function normalize(value) {
  return Math.floor(value * 1000) / 1000;
}
