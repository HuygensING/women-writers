var jade = jade || require('jade').runtime;

this["templates"] = this["templates"] || {};

this["templates"]["src/templates/faceted-search/document"] = function template(locals) {
var buf = [];
var jade_mixins = {};

buf.push("<div class=\"dynamic_s_creator-placeholder\"></div><div class=\"dynamic_s_document_type-placeholder\"></div><div class=\"dynamic_s_date-placeholder\"></div><div class=\"dynamic_s_origin-placeholder\"></div><div class=\"dynamic_s_language-placeholder\"></div><div class=\"dynamic_s_genre-placeholder\"></div><div class=\"dynamic_s_subject-placeholder\"></div>");;return buf.join("");
};

this["templates"]["src/templates/faceted-search/main"] = function template(locals) {
var buf = [];
var jade_mixins = {};

buf.push("<div class=\"overlay\"><div><i class=\"fa fa-spinner fa-spin fa-2x\"></i></div></div><div class=\"faceted-search\"><ul class=\"facets-menu\"><li class=\"reset\"><button><i class=\"fa fa-refresh\"></i><span>Reset search</span></button></li><li class=\"switch\"><button><i class=\"fa fa-angle-double-down\"></i><span>Switch to</span></button></li><li class=\"collapse-expand\"><button><i class=\"fa fa-compress\"></i><span>Collapse facets</span></button></li></ul><div class=\"text-search-placeholder\"></div><div class=\"facets-placeholder\"></div></div>");;return buf.join("");
};

this["templates"]["src/templates/faceted-search/person"] = function template(locals) {
var buf = [];
var jade_mixins = {};

buf.push("<div class=\"dynamic_s_gender-placeholder\"></div><div class=\"dynamic_s_birthDate-placeholder\"></div><div class=\"dynamic_s_residence-placeholder\"></div><div class=\"dynamic_s_language-placeholder\"></div><div class=\"dynamic_s_birthplace-placeholder\"></div><div class=\"dynamic_s_deathDate-placeholder\"></div><div class=\"dynamic_s_deathplace-placeholder\"></div><div class=\"dynamic_s_collective-placeholder\"></div><div class=\"dynamic_s_religion-placeholder\"></div><div class=\"dynamic_s_types-placeholder\"></div>");;return buf.join("");
};

this["templates"]["src/templates/faceted-search/reception-main"] = function template(locals) {
var buf = [];
var jade_mixins = {};

buf.push("<div class=\"overlay\"><div><i class=\"fa fa-spinner fa-spin fa-2x\"></i></div></div><div class=\"faceted-search\"><ul class=\"facets-menu\"><li class=\"reset\"><button><i class=\"fa fa-refresh\"></i><span>Clear selection</span></button></li></ul><div class=\"facets-placeholder\"></div></div>");;return buf.join("");
};

this["templates"]["src/templates/styleguide"] = function template(locals) {
var buf = [];
var jade_mixins = {};

buf.push("<!DOCTYPE html><html><head><meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"><link rel=\"stylesheet\" href=\"//netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css\" type=\"text/css\"><link rel=\"stylesheet\" href=\"/main.css\" type=\"text/css\"></head><body><div class=\"style-guide\"><section><h1>Header 1</h1><h2>Header 2</h2><h3>Header 3</h3><h4>Header 4</h4></section><section><h1>Timbuctoo Form</h1><div class=\"timbuctoo-form\"><form><p><legend>Legend</legend></p><p><input type=\"text\" placeholder=\"Text input...\"></p><p><select><option>Option One</option><option>Option Two</option><option>Option Three</option></select></p><p><button>Button</button></p><p><button disabled>Disabled</button></p><p><button class=\"gray\">Gray Button</button></p></form></div><section><div class=\"gridHolder marginRow\"><div class=\"c4_4 grid\">Full-width asasddfasdfs</div></div><div class=\"gridHolder marginRow\"><div class=\"c4_2 grid\">Half-width</div><div class=\"c4_2 grid\">Half-width</div></div><div class=\"gridHolder marginRow\"><div class=\"c4_1 grid\">One</div><div class=\"c4_3 grid\">Three</div></div></section></section></div><script type=\"text/javascript\">document.write(\"<script async src='//HOST:3003/browser-sync-client.1.1.1.js'><\\/script>\".replace(/HOST/g, location.hostname));\n</script></body></html>");;return buf.join("");
};

this["templates"]["src/templates/views/base-field"] = function template(locals) {
var buf = [];
var jade_mixins = {};
var locals_ = (locals || {}),field = locals_.field;
buf.push("<div" + (jade.cls(['field',field.classes.join(" ")], [null,true])) + "><label>" + (jade.escape(null == (jade.interp = field.title) ? "" : jade.interp)) + "</label>");
if ( field.type == 'Array')
{
buf.push("<div class=\"value\">");
// iterate field.value
;(function(){
  var $$obj = field.value;
  if ('number' == typeof $$obj.length) {

    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
      var v = $$obj[$index];

buf.push("<p>" + (null == (jade.interp = v) ? "" : jade.interp) + "</p>");
    }

  } else {
    var $$l = 0;
    for (var $index in $$obj) {
      $$l++;      var v = $$obj[$index];

buf.push("<p>" + (null == (jade.interp = v) ? "" : jade.interp) + "</p>");
    }

  }
}).call(this);

buf.push("</div>");
}
else
{
buf.push("<div class=\"value\">" + (null == (jade.interp = field.value) ? "" : jade.interp) + "</div>");
}
buf.push("</div>");;return buf.join("");
};

this["templates"]["src/templates/views/base-fieldset"] = function template(locals) {
var buf = [];
var jade_mixins = {};
var locals_ = (locals || {}),fieldset = locals_.fieldset;
buf.push("<div" + (jade.cls(['fieldset','gridHolder',fieldset.empty ? "empty" : ""], [null,null,true])) + ">");
if ( fieldset.title)
{
buf.push("<div class=\"c4_4\"><h4 class=\"title\">" + (jade.escape(null == (jade.interp = fieldset.title) ? "" : jade.interp)) + "</h4></div>");
}
// iterate fieldset.fields
;(function(){
  var $$obj = fieldset.fields;
  if ('number' == typeof $$obj.length) {

    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
      var field = $$obj[$index];

buf.push(null == (jade.interp = field.html) ? "" : jade.interp);
    }

  } else {
    var $$l = 0;
    for (var $index in $$obj) {
      $$l++;      var field = $$obj[$index];

buf.push(null == (jade.interp = field.html) ? "" : jade.interp);
    }

  }
}).call(this);

buf.push("<div class=\"clear\"></div></div>");;return buf.join("");
};

this["templates"]["src/templates/views/base-link"] = function template(locals) {
var buf = [];
var jade_mixins = {};
var locals_ = (locals || {}),link = locals_.link;
if ( link.external)
{
buf.push("<a" + (jade.attr("href", link.url, true, false)) + " target=\"_self\" class=\"link\">" + (jade.escape(null == (jade.interp = link.label) ? "" : jade.interp)) + "</a>");
}
else
{
buf.push("<a" + (jade.attr("href", link.url, true, false)) + " class=\"link\">" + (jade.escape(null == (jade.interp = link.label) ? "" : jade.interp)) + "</a>");
};return buf.join("");
};

this["templates"]["src/templates/views/base"] = function template(locals) {
var buf = [];
var jade_mixins = {};
var locals_ = (locals || {}),config = locals_.config;
buf.push("<div class=\"container\"><div class=\"header centered\"><a" + (jade.attr("href", config.get('baseUrl'), true, false)) + " class=\"home\"><h1>Neww Women Writers</h1></a><a href=\"http://www.huygens.knaw.nl/\" target=\"_self\" class=\"huygens-ing\"></a></div><div class=\"navigation\"><div class=\"centered\"><div class=\"links\"><a href=\"/persons/\" class=\"person\">Persons</a><a href=\"/documents/\" class=\"document\">Documents</a><a href=\"/receptions/\" class=\"reception\">Receptions</a><a href=\"/sources/\" class=\"source\">Sources</a><div class=\"user-status\"></div></div></div></div><div id=\"search\"><div class=\"persons centered\"></div><div class=\"documents centered\"></div><div class=\"receptions\"></div></div><div id=\"view\" class=\"centered\"></div></div>");;return buf.join("");
};

this["templates"]["src/templates/views/busy-overlay"] = function template(locals) {
var buf = [];
var jade_mixins = {};

buf.push("<div class=\"center-spinner\"><i class=\"fa fa-spinner fa-spin fa-5x\"></i></div>");;return buf.join("");
};

this["templates"]["src/templates/views/document/document-overview"] = function template(locals) {
var buf = [];
var jade_mixins = {};
var locals_ = (locals || {}),documents = locals_.documents;
buf.push("<h3>All documents</h3><ul class=\"documents\">");
// iterate documents
;(function(){
  var $$obj = documents;
  if ('number' == typeof $$obj.length) {

    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
      var document = $$obj[$index];

buf.push("<li class=\"document\"><a" + (jade.attr("href", "/document/" + (document.attributes._id) + "", true, false)) + ">" + (jade.escape(null == (jade.interp = document.attributes.title) ? "" : jade.interp)) + "</a></li>");
    }

  } else {
    var $$l = 0;
    for (var $index in $$obj) {
      $$l++;      var document = $$obj[$index];

buf.push("<li class=\"document\"><a" + (jade.attr("href", "/document/" + (document.attributes._id) + "", true, false)) + ">" + (jade.escape(null == (jade.interp = document.attributes.title) ? "" : jade.interp)) + "</a></li>");
    }

  }
}).call(this);

buf.push("</ul>");;return buf.join("");
};

this["templates"]["src/templates/views/document/document-search-results"] = function template(locals) {
var buf = [];
var jade_mixins = {};
var locals_ = (locals || {}),response = locals_.response,sortedBy = locals_.sortedBy,sortableFieldsMap = locals_.sortableFieldsMap,config = locals_.config,showCurated = locals_.showCurated;
buf.push("<h4>" + (jade.escape(null == (jade.interp = response.numFound + (response.numFound != 1 ? ' documents' : ' document') + ' found') ? "" : jade.interp)) + "<div class=\"order-by\"><span>Order by</span>");
if ( response.sortableFields)
{
buf.push("<select>");
if ( sortedBy)
{
buf.push("<option disabled=\"disabled\"></option>");
}
else
{
buf.push("<option disabled=\"disabled\" selected=\"selected\"></option>");
}
// iterate response.sortableFields
;(function(){
  var $$obj = response.sortableFields;
  if ('number' == typeof $$obj.length) {

    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
      var field = $$obj[$index];

if ( sortedBy == field)
{
buf.push("<option" + (jade.attr("value", field, true, false)) + " selected=\"selected\">" + (jade.escape(null == (jade.interp = sortableFieldsMap[field] ? sortableFieldsMap[field] : field) ? "" : jade.interp)) + "</option>");
}
else
{
buf.push("<option" + (jade.attr("value", field, true, false)) + ">" + (jade.escape(null == (jade.interp = sortableFieldsMap[field] ? sortableFieldsMap[field] : field) ? "" : jade.interp)) + "</option>");
}
    }

  } else {
    var $$l = 0;
    for (var $index in $$obj) {
      $$l++;      var field = $$obj[$index];

if ( sortedBy == field)
{
buf.push("<option" + (jade.attr("value", field, true, false)) + " selected=\"selected\">" + (jade.escape(null == (jade.interp = sortableFieldsMap[field] ? sortableFieldsMap[field] : field) ? "" : jade.interp)) + "</option>");
}
else
{
buf.push("<option" + (jade.attr("value", field, true, false)) + ">" + (jade.escape(null == (jade.interp = sortableFieldsMap[field] ? sortableFieldsMap[field] : field) ? "" : jade.interp)) + "</option>");
}
    }

  }
}).call(this);

buf.push("</select>");
}
buf.push("</div></h4><div class=\"cursor\"><span class=\"prev\">&laquo; Previous</span><span class=\"position\">Page&nbsp;<span class=\"current\">" + (jade.escape(null == (jade.interp = 1 + (response.start / config.get('resultRows'))) ? "" : jade.interp)) + "</span>&nbsp;of&nbsp;<span class=\"total\">" + (jade.escape(null == (jade.interp = Math.ceil(response.numFound / config.get('resultRows'))) ? "" : jade.interp)) + "</span></span><div class=\"loader\"></div><span class=\"next\">Next &raquo;</span></div><ol" + (jade.attr("start", response.start + 1, true, false)) + ">");
// iterate response.refs
;(function(){
  var $$obj = response.refs;
  if ('number' == typeof $$obj.length) {

    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
      var document = $$obj[$index];

buf.push("<li" + (jade.cls([showCurated(document) ? 'is-curated' : ''], [true])) + "><a" + (jade.attr("href", config.documentViewUrl(document.id), true, false)) + ">" + (jade.escape(null == (jade.interp = document.displayName) ? "" : jade.interp)) + "</a></li>");
    }

  } else {
    var $$l = 0;
    for (var $index in $$obj) {
      $$l++;      var document = $$obj[$index];

buf.push("<li" + (jade.cls([showCurated(document) ? 'is-curated' : ''], [true])) + "><a" + (jade.attr("href", config.documentViewUrl(document.id), true, false)) + ">" + (jade.escape(null == (jade.interp = document.displayName) ? "" : jade.interp)) + "</a></li>");
    }

  }
}).call(this);

buf.push("</ol>");;return buf.join("");
};

this["templates"]["src/templates/views/document/edit"] = function template(locals) {
var buf = [];
var jade_mixins = {};
var locals_ = (locals || {}),config = locals_.config,document = locals_.document;
buf.push("<div class=\"controls\"><button class=\"btn save\"><i class=\"fa fa-check\"></i>Save</button><a" + (jade.attr("href", config.documentViewUrl(document._id), true, false)) + " class=\"btn gray cancel\"><i class=\"fa fa-times\"></i>Cancel</a></div><h1>" + (jade.escape(null == (jade.interp = document.title) ? "" : jade.interp)) + "</h1><div class=\"form\"></div><div class=\"controls bottom\"><button class=\"btn save\"><i class=\"fa fa-check\"></i>Save</button><a" + (jade.attr("href", config.documentViewUrl(document._id), true, false)) + " class=\"btn gray cancel\"><i class=\"fa fa-times\"></i>Cancel</a></div>");;return buf.join("");
};

this["templates"]["src/templates/views/document/view"] = function template(locals) {
var buf = [];
var jade_mixins = {};
var locals_ = (locals || {}),isDeleted = locals_.isDeleted,canEdit = locals_.canEdit,config = locals_.config,data = locals_.data,receptions = locals_.receptions,_ = locals_._,modified = locals_.modified;
buf.push("<div class=\"controls\">");
if ( isDeleted)
{
buf.push("<div class=\"is-deleted\"><i class=\"fa fa-warning\"></i><span>This record has been deleted.</span></div>");
}
else if ( canEdit)
{
buf.push("<a" + (jade.attr("href", config.editUrl(data._id), true, false)) + " class=\"edit btn green\"><i class=\"fa fa-pencil\"></i>Edit</a><button class=\"delete btn gray right\"><i class=\"fa fa-trash-o\"></i><span class=\"default\">Delete</span><span class=\"confirm\">Confirm deletion</span></button>");
}
else
{
buf.push("<button class=\"btn disabled\"><i class=\"fa fa-ban\"></i>Edit</button><span class=\"processing\">This record is being processed and can not be edited right now.</span>");
}
buf.push("</div><h2>" + (jade.escape(null == (jade.interp = data.title) ? "" : jade.interp)) + "</h2><h4 class=\"author\">" + (jade.escape(null == (jade.interp = data.tempCreator) ? "" : jade.interp)) + "</h4><div class=\"fieldsets\"></div><div class=\"c4_4\">");
if ( receptions && _.keys(receptions).length)
{
buf.push("<h3>Receptions of this work<ul class=\"receptions\">");
// iterate receptions
;(function(){
  var $$obj = receptions;
  if ('number' == typeof $$obj.length) {

    for (var reception = 0, $$l = $$obj.length; reception < $$l; reception++) {
      var list = $$obj[reception];

buf.push("<li><h4>" + (jade.escape(null == (jade.interp = reception) ? "" : jade.interp)) + "</h4><ul>");
// iterate list
;(function(){
  var $$obj = list;
  if ('number' == typeof $$obj.length) {

    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
      var r = $$obj[$index];

buf.push("<li><a" + (jade.attr("href", config.viewUrl(r.id), true, false)) + ">" + (jade.escape(null == (jade.interp = r.displayName) ? "" : jade.interp)) + "</a></li>");
    }

  } else {
    var $$l = 0;
    for (var $index in $$obj) {
      $$l++;      var r = $$obj[$index];

buf.push("<li><a" + (jade.attr("href", config.viewUrl(r.id), true, false)) + ">" + (jade.escape(null == (jade.interp = r.displayName) ? "" : jade.interp)) + "</a></li>");
    }

  }
}).call(this);

buf.push("</ul></li>");
    }

  } else {
    var $$l = 0;
    for (var reception in $$obj) {
      $$l++;      var list = $$obj[reception];

buf.push("<li><h4>" + (jade.escape(null == (jade.interp = reception) ? "" : jade.interp)) + "</h4><ul>");
// iterate list
;(function(){
  var $$obj = list;
  if ('number' == typeof $$obj.length) {

    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
      var r = $$obj[$index];

buf.push("<li><a" + (jade.attr("href", config.viewUrl(r.id), true, false)) + ">" + (jade.escape(null == (jade.interp = r.displayName) ? "" : jade.interp)) + "</a></li>");
    }

  } else {
    var $$l = 0;
    for (var $index in $$obj) {
      $$l++;      var r = $$obj[$index];

buf.push("<li><a" + (jade.attr("href", config.viewUrl(r.id), true, false)) + ">" + (jade.escape(null == (jade.interp = r.displayName) ? "" : jade.interp)) + "</a></li>");
    }

  }
}).call(this);

buf.push("</ul></li>");
    }

  }
}).call(this);

buf.push("</ul></h3>");
}
buf.push("</div>");
if ( canEdit)
{
buf.push("<div class=\"last-modified\">Last modified by user&nbsp;<span class=\"user-id\">" + (jade.escape(null == (jade.interp = modified.userId.replace(/USER0+/g, '')) ? "" : jade.interp)) + "</span>&nbsp;on&nbsp;<span class=\"time\">" + (jade.escape(null == (jade.interp = new Date(modified.timeStamp).toDateString()) ? "" : jade.interp)) + "</span></div>");
};return buf.join("");
};

this["templates"]["src/templates/views/person/edit"] = function template(locals) {
var buf = [];
var jade_mixins = {};
var locals_ = (locals || {}),config = locals_.config,person = locals_.person;
buf.push("<div class=\"controls\"><button class=\"btn save\"><i class=\"fa fa-check\"></i>Save</button><a" + (jade.attr("href", config.personViewUrl(person._id), true, false)) + " class=\"btn gray cancel\"><i class=\"fa fa-times\"></i>Cancel</a></div><h1>" + (jade.escape(null == (jade.interp = person.tempName) ? "" : jade.interp)) + "</h1><div class=\"form\"></div><div class=\"controls bottom\"><button class=\"btn save\"><i class=\"fa fa-check\"></i>Save</button><a" + (jade.attr("href", config.personViewUrl(person._id), true, false)) + " class=\"btn gray cancel\"><i class=\"fa fa-times\"></i>Cancel</a></div>");;return buf.join("");
};

this["templates"]["src/templates/views/person/name-component"] = function template(locals) {
var buf = [];
var jade_mixins = {};
var locals_ = (locals || {}),value = locals_.value;
buf.push("<span class=\"value\">" + (jade.escape(null == (jade.interp = value) ? "" : jade.interp)) + "</span><!-- span.type= type-->");;return buf.join("");
};

this["templates"]["src/templates/views/person/name"] = function template(locals) {
var buf = [];
var jade_mixins = {};
var locals_ = (locals || {}),components = locals_.components;
buf.push("<div class=\"name\">");
// iterate components
;(function(){
  var $$obj = components;
  if ('number' == typeof $$obj.length) {

    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
      var component = $$obj[$index];

buf.push("<span class=\"component\">" + (null == (jade.interp = component) ? "" : jade.interp) + "</span>");
    }

  } else {
    var $$l = 0;
    for (var $index in $$obj) {
      $$l++;      var component = $$obj[$index];

buf.push("<span class=\"component\">" + (null == (jade.interp = component) ? "" : jade.interp) + "</span>");
    }

  }
}).call(this);

buf.push("</div>");;return buf.join("");
};

this["templates"]["src/templates/views/person/person-overview"] = function template(locals) {
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

this["templates"]["src/templates/views/person/person-search-results"] = function template(locals) {
var buf = [];
var jade_mixins = {};
var locals_ = (locals || {}),response = locals_.response,sortedBy = locals_.sortedBy,sortableFieldsMap = locals_.sortableFieldsMap,config = locals_.config,_ = locals_._,showCurated = locals_.showCurated;
buf.push("<h4>" + (jade.escape(null == (jade.interp = response.numFound + (response.numFound != 1 ? ' persons' : ' person') + ' found') ? "" : jade.interp)) + "<div class=\"order-by\"><span>Order by</span>");
if ( response.sortableFields)
{
buf.push("<select>");
if ( sortedBy)
{
buf.push("<option disabled=\"disabled\"></option>");
}
else
{
buf.push("<option disabled=\"disabled\" selected=\"selected\"></option>");
}
// iterate response.sortableFields
;(function(){
  var $$obj = response.sortableFields;
  if ('number' == typeof $$obj.length) {

    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
      var field = $$obj[$index];

if ( sortedBy == field)
{
buf.push("<option" + (jade.attr("value", field, true, false)) + " selected=\"selected\">" + (jade.escape(null == (jade.interp = sortableFieldsMap[field] ? sortableFieldsMap[field] : field) ? "" : jade.interp)) + "</option>");
}
else
{
buf.push("<option" + (jade.attr("value", field, true, false)) + ">" + (jade.escape(null == (jade.interp = sortableFieldsMap[field] ? sortableFieldsMap[field] : field) ? "" : jade.interp)) + "</option>");
}
    }

  } else {
    var $$l = 0;
    for (var $index in $$obj) {
      $$l++;      var field = $$obj[$index];

if ( sortedBy == field)
{
buf.push("<option" + (jade.attr("value", field, true, false)) + " selected=\"selected\">" + (jade.escape(null == (jade.interp = sortableFieldsMap[field] ? sortableFieldsMap[field] : field) ? "" : jade.interp)) + "</option>");
}
else
{
buf.push("<option" + (jade.attr("value", field, true, false)) + ">" + (jade.escape(null == (jade.interp = sortableFieldsMap[field] ? sortableFieldsMap[field] : field) ? "" : jade.interp)) + "</option>");
}
    }

  }
}).call(this);

buf.push("</select>");
}
buf.push("</div></h4><div class=\"cursor\"><span class=\"prev\">&laquo; Previous</span><span class=\"position\">Page&nbsp;<span class=\"current\">" + (jade.escape(null == (jade.interp = 1 + (response.start / config.get('resultRows'))) ? "" : jade.interp)) + "</span>&nbsp;of&nbsp;<span class=\"total\">" + (jade.escape(null == (jade.interp = Math.ceil(response.numFound / config.get('resultRows'))) ? "" : jade.interp)) + "</span></span><div class=\"loader\"></div><span class=\"next\">Next &raquo;</span></div><ol class=\"persons\">");
var personsById = _.object(_.map(response.results, function (p) { return [p._id, p] }));
// iterate response.refs
;(function(){
  var $$obj = response.refs;
  if ('number' == typeof $$obj.length) {

    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
      var person = $$obj[$index];

buf.push("<li" + (jade.cls([showCurated(person) ? 'is-curated' : ''], [true])) + "><a" + (jade.attr("href", config.personViewUrl(person.id), true, false)) + ">");
if ( person.displayName)
{
buf.push("<div class=\"name\">" + (jade.escape(null == (jade.interp = person.displayName) ? "" : jade.interp)) + "</div>");
}
else
{
buf.push("<div class=\"name\"><span class=\"empty-name\">No name provided</span></div>");
}
buf.push("<div class=\"alive\"><span class=\"from\">" + (jade.escape(null == (jade.interp = personsById[person.id] ? (personsById[person.id].birthDate || 'unknown') : 'unknown') ? "" : jade.interp)) + "</span>&nbsp;&ndash;&nbsp;<span class=\"to\">" + (jade.escape(null == (jade.interp = personsById[person.id] ? (personsById[person.id].deathDate || 'unknown') : 'unknown') ? "" : jade.interp)) + "</span></div></a></li>");
    }

  } else {
    var $$l = 0;
    for (var $index in $$obj) {
      $$l++;      var person = $$obj[$index];

buf.push("<li" + (jade.cls([showCurated(person) ? 'is-curated' : ''], [true])) + "><a" + (jade.attr("href", config.personViewUrl(person.id), true, false)) + ">");
if ( person.displayName)
{
buf.push("<div class=\"name\">" + (jade.escape(null == (jade.interp = person.displayName) ? "" : jade.interp)) + "</div>");
}
else
{
buf.push("<div class=\"name\"><span class=\"empty-name\">No name provided</span></div>");
}
buf.push("<div class=\"alive\"><span class=\"from\">" + (jade.escape(null == (jade.interp = personsById[person.id] ? (personsById[person.id].birthDate || 'unknown') : 'unknown') ? "" : jade.interp)) + "</span>&nbsp;&ndash;&nbsp;<span class=\"to\">" + (jade.escape(null == (jade.interp = personsById[person.id] ? (personsById[person.id].deathDate || 'unknown') : 'unknown') ? "" : jade.interp)) + "</span></div></a></li>");
    }

  }
}).call(this);

buf.push("</ol>");;return buf.join("");
};

this["templates"]["src/templates/views/person/view"] = function template(locals) {
var buf = [];
var jade_mixins = {};
var locals_ = (locals || {}),isDeleted = locals_.isDeleted,canEdit = locals_.canEdit,config = locals_.config,data = locals_.data,receptions = locals_.receptions,_ = locals_._,modified = locals_.modified;
buf.push("<div class=\"controls\">");
if ( isDeleted)
{
buf.push("<div class=\"is-deleted\"><i class=\"fa fa-warning\"></i><span>This record has been deleted.</span></div>");
}
else if ( canEdit)
{
buf.push("<a" + (jade.attr("href", config.editUrl(data._id), true, false)) + " class=\"edit btn green\"><i class=\"fa fa-pencil\"></i>Edit</a><button class=\"delete btn gray right\"><i class=\"fa fa-trash-o\"></i><span class=\"default\">Delete</span><span class=\"confirm\">Confirm deletion</span></button>");
}
else
{
buf.push("<button class=\"btn disabled\"><i class=\"fa fa-ban\"></i>Edit</button><span class=\"processing\">This record is being processed and can not be edited right now.</span>");
}
buf.push("</div><h2>" + (jade.escape(null == (jade.interp = data.tempName) ? "" : jade.interp)) + "</h2><div class=\"fieldsets\"></div><div class=\"c4_4\">");
if ( receptions && _.keys(receptions).length)
{
buf.push("<h3>Receptions of this work<ul class=\"receptions\">");
// iterate receptions
;(function(){
  var $$obj = receptions;
  if ('number' == typeof $$obj.length) {

    for (var reception = 0, $$l = $$obj.length; reception < $$l; reception++) {
      var list = $$obj[reception];

buf.push("<li><h4>" + (jade.escape(null == (jade.interp = reception) ? "" : jade.interp)) + "</h4><ul>");
// iterate list
;(function(){
  var $$obj = list;
  if ('number' == typeof $$obj.length) {

    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
      var r = $$obj[$index];

buf.push("<li><a" + (jade.attr("href", config.viewUrl(r.id), true, false)) + ">" + (jade.escape(null == (jade.interp = r.displayName) ? "" : jade.interp)) + "</a></li>");
    }

  } else {
    var $$l = 0;
    for (var $index in $$obj) {
      $$l++;      var r = $$obj[$index];

buf.push("<li><a" + (jade.attr("href", config.viewUrl(r.id), true, false)) + ">" + (jade.escape(null == (jade.interp = r.displayName) ? "" : jade.interp)) + "</a></li>");
    }

  }
}).call(this);

buf.push("</ul></li>");
    }

  } else {
    var $$l = 0;
    for (var reception in $$obj) {
      $$l++;      var list = $$obj[reception];

buf.push("<li><h4>" + (jade.escape(null == (jade.interp = reception) ? "" : jade.interp)) + "</h4><ul>");
// iterate list
;(function(){
  var $$obj = list;
  if ('number' == typeof $$obj.length) {

    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
      var r = $$obj[$index];

buf.push("<li><a" + (jade.attr("href", config.viewUrl(r.id), true, false)) + ">" + (jade.escape(null == (jade.interp = r.displayName) ? "" : jade.interp)) + "</a></li>");
    }

  } else {
    var $$l = 0;
    for (var $index in $$obj) {
      $$l++;      var r = $$obj[$index];

buf.push("<li><a" + (jade.attr("href", config.viewUrl(r.id), true, false)) + ">" + (jade.escape(null == (jade.interp = r.displayName) ? "" : jade.interp)) + "</a></li>");
    }

  }
}).call(this);

buf.push("</ul></li>");
    }

  }
}).call(this);

buf.push("</ul></h3>");
}
buf.push("</div>");
if ( canEdit)
{
buf.push("<div class=\"last-modified\">Last modified by user&nbsp;<span class=\"user-id\">" + (jade.escape(null == (jade.interp = modified.userId.replace(/USER0+/g, '')) ? "" : jade.interp)) + "</span>&nbsp;on&nbsp;<span class=\"time\">" + (jade.escape(null == (jade.interp = new Date(modified.timeStamp).toDateString()) ? "" : jade.interp)) + "</span></div>");
};return buf.join("");
};

this["templates"]["src/templates/views/reception/faceted-search"] = function template(locals) {
var buf = [];
var jade_mixins = {};

buf.push("<b>Type of Reception</b>");;return buf.join("");
};

this["templates"]["src/templates/views/reception/reception-selector"] = function template(locals) {
var buf = [];
var jade_mixins = {};

buf.push("<h3>Reception criteria</h3><div class=\"search-container\"></div>");;return buf.join("");
};

this["templates"]["src/templates/views/reception/search-result"] = function template(locals) {
var buf = [];
var jade_mixins = {};
var locals_ = (locals || {}),response = locals_.response,config = locals_.config,relIds = locals_.relIds;
if ( response)
{
buf.push("<span class=\"found\">" + (jade.escape(null == (jade.interp = response.numFound + ' receptions found') ? "" : jade.interp)) + "</span><ul class=\"num-rows\">");
// iterate [50, 100, 250, 500]
;(function(){
  var $$obj = [50, 100, 250, 500];
  if ('number' == typeof $$obj.length) {

    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
      var num = $$obj[$index];

buf.push("<li" + (jade.attr("data-result-rows", num, true, false)) + ">" + (jade.escape(null == (jade.interp = num) ? "" : jade.interp)) + "</li>");
    }

  } else {
    var $$l = 0;
    for (var $index in $$obj) {
      $$l++;      var num = $$obj[$index];

buf.push("<li" + (jade.attr("data-result-rows", num, true, false)) + ">" + (jade.escape(null == (jade.interp = num) ? "" : jade.interp)) + "</li>");
    }

  }
}).call(this);

buf.push("</ul>");
if ( response['_prev'])
{
buf.push("<p" + (jade.attr("href", response['_prev'], true, false)) + " class=\"prev\">« Previous</p>");
}
if ( response['_next'])
{
buf.push("<p" + (jade.attr("href", response['_next'], true, false)) + " class=\"next\">Next »</p>");
}
if ( response.numFound > 0)
{
buf.push("<table class=\"results-table\"><thead class=\"results-head\"><tr><th></th><th>Type</th><th>Receptions</th></tr></thead><tbody" + (jade.attr("style", "counter-reset: reception-counter " + response.start, true, false)) + " class=\"results-body\">");
// iterate response.refs
;(function(){
  var $$obj = response.refs;
  if ('number' == typeof $$obj.length) {

    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
      var ref = $$obj[$index];

buf.push("<tr><td><a" + (jade.attr("href", config.viewUrl(relIds[ref.id]['^sourceId']), true, false)) + ">" + (jade.escape(null == (jade.interp = ref.sourceName) ? "" : jade.interp)) + "</a></td><td>" + (jade.escape(null == (jade.interp = config.receptionTypeLabel(ref.relationName)) ? "" : jade.interp)) + "</td><td><a" + (jade.attr("href", config.viewUrl(relIds[ref.id]['^targetId']), true, false)) + ">" + (jade.escape(null == (jade.interp = ref.targetName) ? "" : jade.interp)) + "</a></td></tr>");
    }

  } else {
    var $$l = 0;
    for (var $index in $$obj) {
      $$l++;      var ref = $$obj[$index];

buf.push("<tr><td><a" + (jade.attr("href", config.viewUrl(relIds[ref.id]['^sourceId']), true, false)) + ">" + (jade.escape(null == (jade.interp = ref.sourceName) ? "" : jade.interp)) + "</a></td><td>" + (jade.escape(null == (jade.interp = config.receptionTypeLabel(ref.relationName)) ? "" : jade.interp)) + "</td><td><a" + (jade.attr("href", config.viewUrl(relIds[ref.id]['^targetId']), true, false)) + ">" + (jade.escape(null == (jade.interp = ref.targetName) ? "" : jade.interp)) + "</a></td></tr>");
    }

  }
}).call(this);

buf.push("</tbody></table>");
}
else
{
buf.push("<p>No results found</p>");
}
};return buf.join("");
};

this["templates"]["src/templates/views/reception/search"] = function template(locals) {
var buf = [];
var jade_mixins = {};

buf.push("<div class=\"reception-search\"><div class=\"centered query\"><div class=\"tabs\"><div class=\"tab type\"><div class=\"text\">All receptions</div><div class=\"link\">All receptions</div></div><div class=\"tab reception\"><div class=\"text\">(all receptions)</div><div class=\"link\">(all receptions)</div></div><div class=\"tab receptee\"><div class=\"text\">All persons/works</div><div class=\"link\">All persons/works</div></div><div class=\"tab search\"><button class=\"btn search-receptions\"><i class=\"fa fa-search\"></i>Search</button></div></div></div></div><div class=\"views\"><div class=\"select-type centered\"></div><div class=\"select-reception centered hidden\"></div><div class=\"select-receptee centered hidden\"></div></div><div class=\"reception-results centered\"></div>");;return buf.join("");
};

this["templates"]["src/templates/views/reception/source-query-builder"] = function template(locals) {
var buf = [];
var jade_mixins = {};

buf.push("<h3>Search criteria</h3><div class=\"search-container\"></div>");;return buf.join("");
};

this["templates"]["src/templates/views/reception/type-selector"] = function template(locals) {
var buf = [];
var jade_mixins = {};
var locals_ = (locals || {}),documentReceptions = locals_.documentReceptions,config = locals_.config,personReceptions = locals_.personReceptions;
buf.push("<div class=\"help-text\">Select the type of reception you wish to search for\nby selecting one or more of the options in the list to right</div><div data-category=\"work\" class=\"category work\"><h3>Receptions on works</h3><ul>");
// iterate documentReceptions
;(function(){
  var $$obj = documentReceptions;
  if ('number' == typeof $$obj.length) {

    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
      var type = $$obj[$index];

buf.push("<li" + (jade.attr("data-type", type.regularName, true, false)) + (jade.attr("data-type-id", type.typeId, true, false)) + "><span class=\"link\">" + (jade.escape(null == (jade.interp = config.receptionTypeLabel(type.regularName)) ? "" : jade.interp)) + "</span></li>");
    }

  } else {
    var $$l = 0;
    for (var $index in $$obj) {
      $$l++;      var type = $$obj[$index];

buf.push("<li" + (jade.attr("data-type", type.regularName, true, false)) + (jade.attr("data-type-id", type.typeId, true, false)) + "><span class=\"link\">" + (jade.escape(null == (jade.interp = config.receptionTypeLabel(type.regularName)) ? "" : jade.interp)) + "</span></li>");
    }

  }
}).call(this);

buf.push("</ul></div><div data-category=\"person\" class=\"category person\"><h3>Receptions on persons</h3><ul>");
// iterate personReceptions
;(function(){
  var $$obj = personReceptions;
  if ('number' == typeof $$obj.length) {

    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
      var type = $$obj[$index];

buf.push("<li" + (jade.attr("data-type", type.regularName, true, false)) + (jade.attr("data-type-id", type.typeId, true, false)) + "><span class=\"link\">" + (jade.escape(null == (jade.interp = config.receptionTypeLabel(type.regularName)) ? "" : jade.interp)) + "</span></li>");
    }

  } else {
    var $$l = 0;
    for (var $index in $$obj) {
      $$l++;      var type = $$obj[$index];

buf.push("<li" + (jade.attr("data-type", type.regularName, true, false)) + (jade.attr("data-type-id", type.typeId, true, false)) + "><span class=\"link\">" + (jade.escape(null == (jade.interp = config.receptionTypeLabel(type.regularName)) ? "" : jade.interp)) + "</span></li>");
    }

  }
}).call(this);

buf.push("</ul></div>");;return buf.join("");
};

this["templates"]["src/templates/views/relation-type-selector"] = function template(locals) {
var buf = [];
var jade_mixins = {};

buf.push("<div class=\"relation-type-selector-content\"></div>");;return buf.join("");
};

this["templates"]["src/templates/views/search-results"] = function template(locals) {
var buf = [];
var jade_mixins = {};
var locals_ = (locals || {}),response = locals_.response;
buf.push("<h4>" + (jade.escape(null == (jade.interp = response.numFound + ' results') ? "" : jade.interp)) + "</h4><ul>");
// iterate response.results
;(function(){
  var $$obj = response.results;
  if ('number' == typeof $$obj.length) {

    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
      var result = $$obj[$index];

buf.push("<li>" + (jade.escape(null == (jade.interp = result.tempName) ? "" : jade.interp)) + "</li>");
    }

  } else {
    var $$l = 0;
    for (var $index in $$obj) {
      $$l++;      var result = $$obj[$index];

buf.push("<li>" + (jade.escape(null == (jade.interp = result.tempName) ? "" : jade.interp)) + "</li>");
    }

  }
}).call(this);

buf.push("</ul>");;return buf.join("");
};

this["templates"]["src/templates/views/search"] = function template(locals) {
var buf = [];
var jade_mixins = {};

buf.push("<div class=\"search\"></div><div class=\"results\"><h1>Hey there</h1></div>");;return buf.join("");
};

this["templates"]["src/templates/views/sources/list"] = function template(locals) {
var buf = [];
var jade_mixins = {};
var locals_ = (locals || {}),letters = locals_.letters,sources = locals_.sources,config = locals_.config;
buf.push("<ul class=\"index\">");
// iterate letters
;(function(){
  var $$obj = letters;
  if ('number' == typeof $$obj.length) {

    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
      var letter = $$obj[$index];

buf.push("<li" + (jade.attr("data-letter", letter, true, false)) + ">" + (jade.escape(null == (jade.interp = letter) ? "" : jade.interp)) + "</li>");
    }

  } else {
    var $$l = 0;
    for (var $index in $$obj) {
      $$l++;      var letter = $$obj[$index];

buf.push("<li" + (jade.attr("data-letter", letter, true, false)) + ">" + (jade.escape(null == (jade.interp = letter) ? "" : jade.interp)) + "</li>");
    }

  }
}).call(this);

buf.push("</ul><h1>Source Index</h1>");
// iterate letters
;(function(){
  var $$obj = letters;
  if ('number' == typeof $$obj.length) {

    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
      var letter = $$obj[$index];

buf.push("<div" + (jade.attr("data-letter", letter, true, false)) + " class=\"letter\"><h2>" + (jade.escape(null == (jade.interp = letter) ? "" : jade.interp)) + "</h2><ul>");
// iterate sources[letter]
;(function(){
  var $$obj = sources[letter];
  if ('number' == typeof $$obj.length) {

    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
      var source = $$obj[$index];

buf.push("<li><a" + (jade.attr("href", config.sourceViewUrl(source.id), true, false)) + ">" + (jade.escape(null == (jade.interp = source.title) ? "" : jade.interp)) + "</a></li>");
    }

  } else {
    var $$l = 0;
    for (var $index in $$obj) {
      $$l++;      var source = $$obj[$index];

buf.push("<li><a" + (jade.attr("href", config.sourceViewUrl(source.id), true, false)) + ">" + (jade.escape(null == (jade.interp = source.title) ? "" : jade.interp)) + "</a></li>");
    }

  }
}).call(this);

buf.push("</ul></div>");
    }

  } else {
    var $$l = 0;
    for (var $index in $$obj) {
      $$l++;      var letter = $$obj[$index];

buf.push("<div" + (jade.attr("data-letter", letter, true, false)) + " class=\"letter\"><h2>" + (jade.escape(null == (jade.interp = letter) ? "" : jade.interp)) + "</h2><ul>");
// iterate sources[letter]
;(function(){
  var $$obj = sources[letter];
  if ('number' == typeof $$obj.length) {

    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
      var source = $$obj[$index];

buf.push("<li><a" + (jade.attr("href", config.sourceViewUrl(source.id), true, false)) + ">" + (jade.escape(null == (jade.interp = source.title) ? "" : jade.interp)) + "</a></li>");
    }

  } else {
    var $$l = 0;
    for (var $index in $$obj) {
      $$l++;      var source = $$obj[$index];

buf.push("<li><a" + (jade.attr("href", config.sourceViewUrl(source.id), true, false)) + ">" + (jade.escape(null == (jade.interp = source.title) ? "" : jade.interp)) + "</a></li>");
    }

  }
}).call(this);

buf.push("</ul></div>");
    }

  }
}).call(this);
;return buf.join("");
};

this["templates"]["src/templates/views/status"] = function template(locals) {
var buf = [];
var jade_mixins = {};

buf.push("<div class=\"loading box\"><h1>Please wait...</h1></div><div class=\"error box\"><h1><i class=\"fa fa-warning\"></i><span class=\"title\">Error</span></h1><div class=\"message\">I'm very sorry, but it seems an error has occurred.</div><button type=\"button\" class=\"btn ok\">OK</button></div><div class=\"success box\"><h1><i class=\"fa fa-check\"></i><span class=\"title\">Success!</span></h1></div>");;return buf.join("");
};

this["templates"]["src/templates/views/user-status"] = function template(locals) {
var buf = [];
var jade_mixins = {};
var locals_ = (locals || {}),commonName = locals_.commonName;
buf.push("<a href=\"#\" class=\"login\">Login</a><div class=\"loader\">Logging in</div><span><span class=\"label\">Logged in as&nbsp;</span><span class=\"user-name\">" + (jade.escape(null == (jade.interp = commonName ? commonName : 'unknown') ? "" : jade.interp)) + "</span></span>");;return buf.join("");
};

this["templates"]["src/templates/views/view-controls"] = function template(locals) {
var buf = [];
var jade_mixins = {};
var locals_ = (locals || {}),isDeleted = locals_.isDeleted,canEdit = locals_.canEdit,config = locals_.config,data = locals_.data;
if ( isDeleted)
{
buf.push("<div class=\"is-deleted\"><i class=\"fa fa-warning\"></i><span>This record has been deleted.</span></div>");
}
else if ( canEdit)
{
buf.push("<a" + (jade.attr("href", config.editUrl(data._id), true, false)) + " class=\"edit btn green\"><i class=\"fa fa-pencil\"></i>Edit</a><button class=\"delete btn gray right\"><i class=\"fa fa-trash-o\"></i><span class=\"default\">Delete</span><span class=\"confirm\">Confirm deletion</span></button>");
}
else
{
buf.push("<button class=\"btn disabled\"><i class=\"fa fa-ban\"></i>Edit</button><span class=\"processing\">This record is being processed and can not be edited right now.</span>");
};return buf.join("");
};

this["templates"]["src/templates/views/view-footer"] = function template(locals) {
var buf = [];
var jade_mixins = {};
var locals_ = (locals || {}),canEdit = locals_.canEdit,modified = locals_.modified;
if ( canEdit)
{
buf.push("<div class=\"last-modified\">Last modified by user&nbsp;<span class=\"user-id\">" + (jade.escape(null == (jade.interp = modified.userId.replace(/USER0+/g, '')) ? "" : jade.interp)) + "</span>&nbsp;on&nbsp;<span class=\"time\">" + (jade.escape(null == (jade.interp = new Date(modified.timeStamp).toDateString()) ? "" : jade.interp)) + "</span></div>");
};return buf.join("");
};

this["templates"]["src/templates/views/view-receptions"] = function template(locals) {
var buf = [];
var jade_mixins = {};
var locals_ = (locals || {}),receptions = locals_.receptions,_ = locals_._,config = locals_.config;
buf.push("<div class=\"c4_4\">");
if ( receptions && _.keys(receptions).length)
{
buf.push("<h3>Receptions of this work<ul class=\"receptions\">");
// iterate receptions
;(function(){
  var $$obj = receptions;
  if ('number' == typeof $$obj.length) {

    for (var reception = 0, $$l = $$obj.length; reception < $$l; reception++) {
      var list = $$obj[reception];

buf.push("<li><h4>" + (jade.escape(null == (jade.interp = reception) ? "" : jade.interp)) + "</h4><ul>");
// iterate list
;(function(){
  var $$obj = list;
  if ('number' == typeof $$obj.length) {

    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
      var r = $$obj[$index];

buf.push("<li><a" + (jade.attr("href", config.viewUrl(r.id), true, false)) + ">" + (jade.escape(null == (jade.interp = r.displayName) ? "" : jade.interp)) + "</a></li>");
    }

  } else {
    var $$l = 0;
    for (var $index in $$obj) {
      $$l++;      var r = $$obj[$index];

buf.push("<li><a" + (jade.attr("href", config.viewUrl(r.id), true, false)) + ">" + (jade.escape(null == (jade.interp = r.displayName) ? "" : jade.interp)) + "</a></li>");
    }

  }
}).call(this);

buf.push("</ul></li>");
    }

  } else {
    var $$l = 0;
    for (var reception in $$obj) {
      $$l++;      var list = $$obj[reception];

buf.push("<li><h4>" + (jade.escape(null == (jade.interp = reception) ? "" : jade.interp)) + "</h4><ul>");
// iterate list
;(function(){
  var $$obj = list;
  if ('number' == typeof $$obj.length) {

    for (var $index = 0, $$l = $$obj.length; $index < $$l; $index++) {
      var r = $$obj[$index];

buf.push("<li><a" + (jade.attr("href", config.viewUrl(r.id), true, false)) + ">" + (jade.escape(null == (jade.interp = r.displayName) ? "" : jade.interp)) + "</a></li>");
    }

  } else {
    var $$l = 0;
    for (var $index in $$obj) {
      $$l++;      var r = $$obj[$index];

buf.push("<li><a" + (jade.attr("href", config.viewUrl(r.id), true, false)) + ">" + (jade.escape(null == (jade.interp = r.displayName) ? "" : jade.interp)) + "</a></li>");
    }

  }
}).call(this);

buf.push("</ul></li>");
    }

  }
}).call(this);

buf.push("</ul></h3>");
}
buf.push("</div>");;return buf.join("");
};

if (typeof exports === 'object' && exports) {module.exports = this["templates"];}