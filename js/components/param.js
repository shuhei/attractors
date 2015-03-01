import React from 'react';
import store from '../store';

export var Param = React.createClass({
  valueChanged(e) {
    var value = parseFloat(e.target.value, 10);
    store.setParam(this.props.index, value);
  },
  useColorChanged(e) {
    store.setUseColor(this.props.index, e.target.checked);
  },
  render() {
    var value = this.props.useColor ? 0 : (this.props.value || 0);
    var display = this.props.useColor ? '' : this.props.value;
    var disabled = this.props.useColor || this.props.value === undefined;
    var paramName = String.fromCharCode(97 + this.props.index);
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
