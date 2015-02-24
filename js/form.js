var store = require('./store');
var attractors = require('./attractor');

var paramNames = ['a', 'b', 'c', 'd', 'e', 'f'];

var select = document.getElementsByName('attractor')[0];
var fields = paramNames.reduce(function(acc, name) {
  acc[name] = document.getElementsByName(name)[0];
  return acc;
}, {});
var paramValues = paramNames.reduce(function(acc, name) {
  acc[name] = document.getElementsByName(name + '-value')[0];
  return acc;
}, {});
var button = document.getElementsByName('randomize')[0];

// Add DOM event handlers.
paramNames.forEach(function(name) {
  fields[name].addEventListener('change', function() {
    var params = paramNames.reduce(function(acc, name) {
      var field = fields[name];
      acc[name] = parseFloat(field.value, 10);
      return acc;
    }, {});
    store.setParams(params);
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

  // Update range sliders.
  Object.keys(store.params).forEach(function(name) {
    fields[name].value = store.params[name];
  });

  updateTexts();
}


function updateTexts() {
  Object.keys(store.params).forEach(function(name) {
    var value = store.params[name];
    paramValues[name].textContent = value;
  });
}

function findAttractorName(attractor) {
  return Object.keys(attractors).filter(function(name) {
    return attractors[name] === attractor;
  })[0];
}

module.exports = {};
