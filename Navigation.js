var component = this;
this.options = {};

component.TotalClicks = 0;

// figure out how to move this external
var style = `
<style>
  #nav ul {
    display: inline;
    list-style: none;
  }
  #nav ul li {
    float: left;
    margin-right: 20px;
  }
</style>
`

var template = `
<navbar id="nav">
  <ul>
    <li>Home</li>
    <li>App1</li>
    <li>App2</li>
    <li>App3</li>
    <li id="doit">Do it! {{ component.TotalClicks }}</li>
  </ul>
</navbar>
`;

// custom handlebar parsing
// because why not
function parseTemplate(template) {
  var parsed = template;
  template.match(/{{\s*.+\s*}}/g)
   .forEach(function(x) {
     var expression = x.match(/.+/)[0];
     expression = expression.replace('{{', '').replace('}}', '');
     parsed = parsed.replace(x, eval(expression));
   });
   return parsed;
}

function init() {
  var doit = document.getElementById('doit');
  doit.addEventListener('click', function() {
    component.TotalClicks++;
    fire('DidIt', { timesClicked: component.TotalClicks });
    refresh();
  });
}

function refresh() {
  exports.render(component.options);
}

exports.render = function (options) {
  component.options = options;
  var elementId = (options && options.elementId) || 'Navigation';
  var container = document.getElementById(elementId);

  if(container) {
    var parsed = parseTemplate(template)
    parsed = style + parsed;
    container.innerHTML = parsed;
    init();
  }
}

var actions = [];
exports.on = function(eventName, cb, thisArg) {
  if (!actions[eventName]) {
      actions[eventName] = [];
    }
  actions[eventName].push(cb.bind(thisArg));
}

function fire (eventName, params) {
  if(!actions[eventName]) return;
    actions[eventName].forEach((cb) => {
      cb(params);
    });
}

// attempt to self document
exports.events = {}
exports.events.available = ['DidIt']
