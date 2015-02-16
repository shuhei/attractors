var select = document.getElementsByName('attractor')[0];
var fields = ['a', 'b', 'c', 'd', 'e', 'f'].map(function(name) {
  return document.getElementsByName(name)[0];
});
var button = document.getElementsByName('update')[0];

var listeners = [];
var form = {
  data: null,
  onUpdate: onUpdate
  // TODO: set
};
updateData();

button.addEventListener('click', function() {
  updateData();
  listeners.forEach(function(listener) {
    listener();
  });
});

module.exports = form;

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
