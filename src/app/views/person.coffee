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
		@$el.html @template person: @model.attributes
		schema = createTimbuctooSchema personDescription,
			exclude: [
				/^[_@^]/
				'DELETED'
				'ID'
				'PID'
				'ROLES'
				'VARIATIONS'
				'names'
			]
			readonly: [ /^temp/	]

		schema['timbuctoo-relation.language'] = type: 'Relation'

		@form = new Form
			className: 'timbuctoo-form'
			authToken: config.get 'authToken'
			VRE_ID: config.get 'VRE_ID'
			model: @model
			schema: schema

		@$('.form').html @form.el

module.exports = Person