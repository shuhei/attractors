import React from 'react';

import store from '../store';

function valueChanged(index) {
  return e => {
    const value = parseFloat(e.target.value, 10);
    store.setParam(index, value);
  };
}

function useColorChanged(index) {
  return e => {
    store.setUseColor(index, e.target.checked);
  };
}

export default function ({ useColor, value, index }) {
  const v = useColor ? 0 : (value || 0);
  const display = useColor ? '' : value;
  const disabled = useColor || value === undefined;
  const paramName = String.fromCharCode(97 + index);
  return (
    <div className="param">
      <label>{paramName}</label>
      <input type="range" min="-3" max="3" step="0.001" value={v} disabled={disabled} onChange={valueChanged(index)} />
      <span className="param__display">{display}</span>
      <label><input type="checkbox" checked={useColor} onChange={useColorChanged(index)} />color</label>
    </div>
  );
}
