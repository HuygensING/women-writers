Backbone = require 'backbone'
$ = require 'jquery'

baseTemplate = require '../../templates/views/base.jade'
config = require '../models/config.coffee'

Form = require 'timbuctoo-edit-forms/src/coffee/views/form.coffee'
{createTimbuctooSchema}  = require 'timbuctoo-edit-forms/src/coffee/helpers.coffee'

module.exports = class AppView extends Backbone.View
	template: baseTemplate
	initialize: ->
		@render()

	render: ->
		@$el.html @template()

		xhr = $.getJSON config.personURL 'PERS000000015846'
		xhr.done (data) =>
			console.log data
			form = new Form
				model: new Backbone.Model data
				schema: createTimbuctooSchema data
			@$el.append form.el