var store = require('./store');
var attractors = require('./attractor');

var paramNames = ['a', 'b', 'c', 'd', 'e', 'f'];

var select = document.getElementsByName('attractor')[0];
var fields = paramNames.reduce(function(acc, name) {
  acc[name] = document.getElementsByName(name)[0];
  return acc;
}, {});
var displays = paramNames.reduce(function(acc, name) {
  acc[name] = document.getElementsByName(name + '-value')[0];
  return acc;
}, {});
var button = document.getElementsByName('randomize')[0];

// Add DOM event handlers.
paramNames.forEach(function(name) {
  var field = fields[name];
  field.addEventListener('change', function(e) {
    var value = parseFloat(field.value, 10);
    store.setParam(name, value);
  });
});

select.addEventListener('change', function() {
  store.setAttractor(select.value);
});

button.addEventListener('click', function() {
  store.randomizeParams();
});

// Render.
render();

store.onUpdate(function() {
  render();
});

function render() {
  // Update select.
  select.value = store.attractor;

  // Update range sliders and param display.
  paramNames.forEach(function(name) {
    var value = store.params[name];
    var field = fields[name];
    var display = displays[name];
    if (value === undefined) {
      field.value = 0;
      field.disabled = true;
      display.textContent = '';
    } else {
      field.value = value;
      field.disabled = false;
      display.textContent = value;
    }
  });
}

function findAttractorName(attractor) {
  return Object.keys(attractors).filter(function(name) {
    return attractors[name] === attractor;
  })[0];
}

module.exports = {};
