var jade = jade || require('jade').runtime;

this["templates"] = this["templates"] || {};

this["templates"]["src/templates/views/base"] = function template(locals) {
var buf = [];
var jade_mixins = {};

buf.push("<div class=\"container\"><h1>Neww Women Writers</h1><div class=\"sections\"><a href=\"/person\" class=\"btn person\">All persons</a><a href=\"/work\" class=\"btn works\">All works</a></div><div id=\"view\"></div></div>");;return buf.join("");
};

this["templates"]["src/templates/views/person-overview"] = function template(locals) {
var buf = [];
var jade_mixins = {};
var locals_ = (locals || {}),persons = locals_.persons;
buf.push("<h1>All persons</h1>");
// iterate persons
;(function(){
  var $$obj = persons;
  if ('number' == typeof $$obj.length) {

    for (var idx = 0, $$l = $$obj.length; idx < $$l; idx++) {
      var person = $$obj[idx];

buf.push("<div class=\"person\">" + (jade.escape(null == (jade.interp = person.attributes._id) ? "" : jade.interp)) + "</div>");
    }

  } else {
    var $$l = 0;
    for (var idx in $$obj) {
      $$l++;      var person = $$obj[idx];

buf.push("<div class=\"person\">" + (jade.escape(null == (jade.interp = person.attributes._id) ? "" : jade.interp)) + "</div>");
    }

  }
}).call(this);
;return buf.join("");
};

if (typeof exports === 'object' && exports) {module.exports = this["templates"];}