import attractors from './attractor';
import { toAlphabet, toIndex } from './utils';

const AMPLITUDE = 3;

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
    const defaults = attractors[attractor].defaults;
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
    this.params = this.params.map(() => {
      const value = Math.random() * AMPLITUDE * 2 - AMPLITUDE;
      return normalize(value);
    });
    this.notify();
  }

  setState(state) {
    const params = [];
    const useColor = [];
    for (let name of Object.keys(state)) {
      const value = state[name];
      if (name === 'attractor') {
        this.attractor = value;
      } else {
        const index = toIndex(name);
        if (value === 'blue') {
          params[index] = 0;
          useColor[index] = true;
        } else {
          params[index] = parseFloat(value, 10);
          useColor[index] = false;
        }
      }
    }
    this.params = params;
    this.useColor = useColor;
    this.notify();
  }

  notify() {
    this.listeners.forEach((listener) => {
      listener();
    });
  }

  serialize() {
    const params = {
      attractor: this.attractor
    };
    this.params.forEach((value, index) => {
      params[toAlphabet(index)] = value;
    });
    this.useColor.forEach((value, index) => {
      if (value) {
        params[toAlphabet(index)] = 'blue';
      }
    });
    return params;
  }
}

const store = new Store();
export default store;

function normalize(value) {
  return Math.floor(value * 1000) / 1000;
}
