import React from 'react';
import store from '../store';

export const Param = React.createClass({
  valueChanged(e) {
    const value = parseFloat(e.target.value, 10);
    store.setParam(this.props.index, value);
  },
  useColorChanged(e) {
    store.setUseColor(this.props.index, e.target.checked);
  },
  render() {
    const value = this.props.useColor ? 0 : (this.props.value || 0);
    const display = this.props.useColor ? '' : this.props.value;
    const disabled = this.props.useColor || this.props.value === undefined;
    const paramName = String.fromCharCode(97 + this.props.index);
    return (
      <div className="param">
        <label>{paramName}</label>
        <input type="range" min="-3" max="3" step="0.001" value={value} disabled={disabled} onChange={this.valueChanged} />
        <span className="param__display">{display}</span>
        <label><input type="checkbox" checked={this.props.useColor} onChange={this.useColorChanged} />color</label>
      </div>
    );
  }
});
