var jade = jade || require('jade').runtime;

this["templates"] = this["templates"] || {};

this["templates"]["src/templates/views/base"] = function template(locals) {
var buf = [];
var jade_mixins = {};

buf.push("<div class=\"container\"><h1>Neww Women Writers</h1><div class=\"sections\"><a href=\"/person\" class=\"btn person\">All persons</a><a href=\"/work\" class=\"btn works\">All works</a></div><div class=\"form\"></div></div>");;return buf.join("");
};

if (typeof exports === 'object' && exports) {module.exports = this["templates"];}