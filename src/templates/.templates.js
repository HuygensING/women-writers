var jade = jade || require('jade').runtime;

this["templates"] = this["templates"] || {};

this["templates"]["src/templates/views/base"] = function template(locals) {
var buf = [];
var jade_mixins = {};

buf.push("<div class=\"container\"><div class=\"header centered\"><h1>Neww Women Writers</h1><a href=\"http://www.huygens.knaw.nl/\" target=\"_self\" class=\"huygens-ing\"></a></div><div class=\"navigation\"><div class=\"centered\"><a href=\"/person\" class=\"person\">All persons</a><a href=\"/work\" class=\"works\">All works</a><a href=\"/search\">Search</a></div></div><div id=\"view\" class=\"centered\"></div></div>");;return buf.join("");
};

this["templates"]["src/templates/views/person-overview"] = function template(locals) {
var buf = [];
var jade_mixins = {};
var locals_ = (locals || {}),persons = locals_.persons;
buf.push("<h3>All persons</h3><ul class=\"persons\">");
// iterate persons
;(function(){
  var $$obj = persons;
  if ('number' == typeof $$obj.length) {

    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
      var person = $$obj[$index];

buf.push("<li class=\"person\"><a" + (jade.attr("href", "/person/" + (person.attributes._id) + "", true, false)) + ">" + (jade.escape(null == (jade.interp = person.attributes.tempName) ? "" : jade.interp)) + "</a></li>");
    }

  } else {
    var $$l = 0;
    for (var $index in $$obj) {
      $$l++;      var person = $$obj[$index];

buf.push("<li class=\"person\"><a" + (jade.attr("href", "/person/" + (person.attributes._id) + "", true, false)) + ">" + (jade.escape(null == (jade.interp = person.attributes.tempName) ? "" : jade.interp)) + "</a></li>");
    }

  }
}).call(this);

buf.push("</ul>");;return buf.join("");
};

this["templates"]["src/templates/views/person"] = function template(locals) {
var buf = [];
var jade_mixins = {};

buf.push("<h1>Person!</h1><div class=\"form\"></div>");;return buf.join("");
};

if (typeof exports === 'object' && exports) {module.exports = this["templates"];}