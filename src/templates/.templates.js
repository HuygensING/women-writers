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
buf.push("<h1>All persons</h1><ul class=\"persons\"></ul>");
// iterate persons
;(function(){
  var $$obj = persons;
  if ('number' == typeof $$obj.length) {

    for (var idx = 0, $$l = $$obj.length; idx < $$l; idx++) {
      var person = $$obj[idx];

buf.push("<li class=\"person\"><a" + (jade.attr("href", "/person/" + (person.attributes._id) + "", true, false)) + ">" + (jade.escape(null == (jade.interp = person.attributes._id) ? "" : jade.interp)) + "</a></li>");
    }

  } else {
    var $$l = 0;
    for (var idx in $$obj) {
      $$l++;      var person = $$obj[idx];

buf.push("<li class=\"person\"><a" + (jade.attr("href", "/person/" + (person.attributes._id) + "", true, false)) + ">" + (jade.escape(null == (jade.interp = person.attributes._id) ? "" : jade.interp)) + "</a></li>");
    }

  }
}).call(this);
;return buf.join("");
};

this["templates"]["src/templates/views/person"] = function template(locals) {
var buf = [];
var jade_mixins = {};

buf.push("<h1>Person!</h1><div class=\"form\"></div>");;return buf.join("");
};

if (typeof exports === 'object' && exports) {module.exports = this["templates"];}