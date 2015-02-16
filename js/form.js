var paramNames = ['a', 'b', 'c', 'd', 'e', 'f'];
var select = document.getElementsByName('attractor')[0];
var fields = paramNames.map(function(name) {
  return document.getElementsByName(name)[0];
});
var paramValues = paramNames.map(function(name) {
  return document.getElementsByName(name + '-value')[0];
});
var button = document.getElementsByName('update')[0];

var listeners = [];
var form = {
  data: null,
  onUpdate: onUpdate,
  set: set
};
updateData();
updateView();

fields.forEach(function(field) {
  field.addEventListener('change', function() {
    updateData();
    updateView();
  });
});

button.addEventListener('click', function() {
  listeners.forEach(function(listener) {
    listener();
  });
});

module.exports = form;

function set(attractor, a, b, c, d, e, f) {
  var args = arguments;
  select.value = attractor;
  fields.forEach(function(field, i) {
    field.value = args[i + 1];
  });
  updateData();
  updateView();
}

function updateView() {
  form.data.params.forEach(function(param, i) {
    paramValues[i].innerText = param;
  });
}

function updateData() {
  var attractor = select.value;
  var params = fields.map(function(field) {
    return parseFloat(field.value, 10);
  });
  form.data = {
    attractor: attractor,
    params: params
  };
}
  
function onUpdate(listener) {
  listeners.push(listener);
};
