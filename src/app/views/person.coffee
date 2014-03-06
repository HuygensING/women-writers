Backbone = require 'backbone'

config = require '../config.coffee'

personDescription = require '../../data/wwperson.json'
Form = require 'timbuctoo-edit-forms/src/coffee/views/form.coffee'
{createTimbuctooSchema}  = require 'timbuctoo-edit-forms/src/coffee/helpers.coffee'

class Person extends Backbone.View
	template: require '../../templates/views/person.jade'
	initialize: ->
		@render() if @model?

	render: ->
		@$el.html @template()
		schema = {}
		schema[key] = 'Text' for key, val of personDescription when not key.match /^\^/
		console.log schema
		form = new Form
			model: @model
			schema: schema

		console.log form.el

		@$el.html form.el

module.exports = Person