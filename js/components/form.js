import React from 'react';
import { Param } from './param';
import store from '../store';
import attractors from '../attractor';

export const Form = React.createClass({
  componentDidMount() {
    store.onUpdate(this.forceUpdate.bind(this));
  },
  componentWillUnmount() {
    // TODO: Remove listener.
  },
  randomizeParams() {
    store.randomizeParams();
  },
  setAttractor(e) {
    store.setAttractor(e.target.value);
  },
  render() {
    const params = store.params.map((value, index) => {
      return <Param key={index}
                    index={index}
                    value={value}
                    useColor={store.useColor[index]} />;
    });
    // TODO: Create options from data.
    return (
      <div>
        <select name="attractor" value={store.attractor} onChange={this.setAttractor}>
          <option value="kingsDream">The King's Dream</option>
          <option value="rampe1">Rampe 1</option>
          <option value="rampe3">Rampe 3</option>
          <option value="rampe4">Rampe 4</option>
          <option value="rampe6">Rampe 6</option>
          <option value="rampe7">Rampe 7</option>
          <option value="rampe8">Rampe 8</option>
          <option value="pickover">Pickover</option>
        </select>
        <div>{params}</div>
        <button type="button" onClick={this.randomizeParams}>Randomize</button>
      </div>
    );
  }
});
