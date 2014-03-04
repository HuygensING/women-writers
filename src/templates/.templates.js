var jade = jade || require('jade').runtime;

this["templates"] = this["templates"] || {};

this["templates"]["src/templates/views/base"] = function template(locals) {
var buf = [];
var jade_mixins = {};

buf.push("<h1>hola</h1>");;return buf.join("");
};

if (typeof exports === 'object' && exports) {module.exports = this["templates"];}