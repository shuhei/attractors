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

var listeners = [];
var form = {
  data: null,
  onUpdate: onUpdate,
  set: set
};
fetchParams();
updateTexts();

paramNames.forEach(function(name) {
  fields[name].addEventListener('change', function() {
    fetchParams();
    updateTexts();
    notify();
  });
});

select.addEventListener('change', function() {
  fetchParams();
  updateTexts();
  notify();
});

button.addEventListener('click', function() {
  randomizeParams();
  notify();
});

module.exports = form;

function set(attractor, params) {
  select.value = attractor;
  Object.keys(params).forEach(function(name) {
    fields[name].value = params[name];
  });
  fetchParams();
  updateTexts();
}

function fetchParams() {
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

function randomizeParams() {
  var amplitude = 3;
  var newParams = paramNames.reduce(function(acc, name) {
    acc[name] = Math.random() * amplitude * 2 - amplitude;
    return acc;
  }, {});
  set(select.value, newParams);
}

function updateTexts() {
  Object.keys(form.data.params).forEach(function(name, i) {
    paramValues[name].innerText = form.data.params[name];
  });
}

function onUpdate(listener) {
  listeners.push(listener);
};

function notify() {
  listeners.forEach(function(listener) {
    listener();
  });
}
