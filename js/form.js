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
var button = document.getElementsByName('update')[0];

var listeners = [];
var form = {
  data: null,
  onUpdate: onUpdate,
  set: set
};
updateData();
updateView();

paramNames.forEach(function(name) {
  fields[name].addEventListener('change', function() {
    updateData();
    updateView();
  });
});

select.addEventListener('change', function() {
  updateData();
  updateView();
});

button.addEventListener('click', function() {
  console.log(form.data);
  listeners.forEach(function(listener) {
    listener();
  });
});

module.exports = form;

function set(attractor, params) {
  select.value = attractor;
  Object.keys(params).forEach(function(name) {
    fields[name].value = params[name];
  });
  updateData();
  updateView();
}

function updateData() {
  var attractor = select.value;
  var params = paramNames.reduce(function(acc, name) {
    var field = fields[name];
    acc[name] = parseFloat(field.value, 10);
    return acc;
  }, {});
  form.data = {
    attractor: attractor,
    params: params
  };
}

function updateView() {
  Object.keys(form.data.params).forEach(function(name, i) {
    paramValues[name].innerText = form.data.params[name];
  });
}

function onUpdate(listener) {
  listeners.push(listener);
};
