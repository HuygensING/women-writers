Backbone = require 'backbone'
$ = require 'jquery'

baseTemplate = require '../../templates/views/base.jade'
config = require '../config.coffee'

personDescription = require '../../data/wwperson.json'

Form = require 'timbuctoo-edit-forms/src/coffee/views/form.coffee'
{createTimbuctooSchema}  = require 'timbuctoo-edit-forms/src/coffee/helpers.coffee'

module.exports = class AppView extends Backbone.View
	template: baseTemplate
	initialize: ->
		@render()

	render: ->
		@$el.html @template()

		xhr = $.getJSON config.personURL 'PERS000000014854'
		xhr.done (data) =>
			# schema = createTimbuctooSchema personDescription
			schema = {}
			schema[key] = 'Text' for key, val of personDescription when not key.match /^\^/
			form = new Form
				model: new Backbone.Model data
				schema: schema
			@$('.form').html form.el