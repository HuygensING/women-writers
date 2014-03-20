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

		languageRelationType = config.get('relationTypes')['language']

		schema['timbuctoo-relation.language'] =
			type: 'Relation'
			relationTypeDescription:
				relationTypeVariation: config.get 'relationTypeVariation'
				targetType: languageRelationType.targetTypeName
				relationTypeId: languageRelationType._id
			title: 'Languages'
			options: config.get 'languages'

		@form = new Form
			className: 'timbuctoo-form'
			authToken: config.get 'authToken'
			VRE_ID: config.get 'VRE_ID'
			relationsUrl: config.relationsUrl()
			model: @model
			schema: schema
			fields: [
				'tempName'
				'gender'
				'birthDate'
				'deathDate'
				'timbuctoo-relation.language'
				'types'
				'livedIn'
				'children'
				'bibliography'
				'educations'
				'professions'
				'religions'
				'financials'
				'health'
				'nationality'
				'personalSituation'
			]

		@$('.form').html @form.el

module.exports = Person