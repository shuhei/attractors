import React from 'react';

import Param from './param';
import store from '../store';

function randomizeParams() {
  store.randomizeParams();
}

function setAttractor(e) {
  store.setAttractor(e.target.value);
}

function connectToStore(Component) {
  return class extends React.Component {
    constructor() {
      super();
      this.state = store.getData();
    }

    componentDidMount() {
      store.onUpdate(data => this.setState(data));
    }

    render() {
      return <Component {...this.state} />;
    }
  };
}

function Form({ params, attractor, useColor }) {
  const sliders = params.map((value, index) =>
    <Param
      key={index}
      index={index}
      value={value}
      useColor={useColor[index]}
    />
  );
  // TODO: Create options from data.
  return (
    <div>
      <select name="attractor" value={attractor} onChange={setAttractor}>
        <option value="kingsDream">The King's Dream</option>
        <option value="rampe1">Rampe 1</option>
        <option value="rampe3">Rampe 3</option>
        <option value="rampe4">Rampe 4</option>
        <option value="rampe6">Rampe 6</option>
        <option value="rampe7">Rampe 7</option>
        <option value="rampe8">Rampe 8</option>
        <option value="pickover">Pickover</option>
      </select>
      <div>{sliders}</div>
      <button type="button" onClick={randomizeParams}>Randomize</button>
    </div>
  );
}
Form.propTypes = {
  useColor: React.PropTypes.array,
  attractor: React.PropTypes.string,
  params: React.PropTypes.array,
};

const ConnectedForm = connectToStore(Form);
export default ConnectedForm;
