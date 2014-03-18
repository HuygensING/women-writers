Backbone = require 'backbone'
_ = require 'underscore'

config = require '../config.coffee'

personDescription = require '../../data/metadata/wwperson.json'
Form = require 'timbuctoo-edit-forms/src/coffee/views/form.coffee'
{createTimbuctooSchema}  = require 'timbuctoo-edit-forms/src/coffee/helpers.coffee'

class Person extends Backbone.View
	className: 'person-edit'
	template: require '../../templates/views/person.jade'

	events:
		'click .save': 'savePerson'

	initialize: ->
		@render() if @model?

	savePerson: ->
		@form.save()

	render: ->
		@$el.html @template()
		schema = createTimbuctooSchema personDescription,
			exclude: [
				/^[_@^]/
				'DELETED'
				'ID'
				'PID'
				'ROLES'
				'VARIATIONS'
				'children'
				'names'
			]
		
		# for key, val of personDescription when not key.match /^\^/
		# 	if key.match /^temp/
		# 		schema[key] =
		# 			type: 'ReadOnly'

		console.log schema

		tempFields = (key for key, val of schema when key.match /^temp/)
		nonTempFields = (key for key, val of schema when not key.match /^temp/)

		@form = new Form
			className: 'timbuctoo-form'
			authToken: config.get 'authToken'
			VRE_ID: config.get 'VRE_ID'
			model: @model
			schema: schema
			fieldsets: [
				{ 
					fields: nonTempFields,
					legend: ''
				},
				{
					fields: tempFields,
					legend: 'Temporary Fields'
				}
			]

		@$('.form').html @form.el

module.exports = Person