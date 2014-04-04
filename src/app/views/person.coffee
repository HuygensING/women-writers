Backbone = require 'backbone'
_ = require 'underscore'

config = require '../config.coffee'

personDescription = require '../../data/metadata/wwperson.json'
Form = require 'timbuctoo-edit-forms/src/coffee/views/form.coffee'
{createTimbuctooSchema}  = require 'timbuctoo-edit-forms/src/coffee/helpers.coffee'
{searchQuery, simpleSearch} = require '../helpers/search'

class Person extends Backbone.View
	className: 'person-edit'
	template: require '../../templates/views/person.jade'

	relationTypes: [
		'hasPersonLanguage'
		'isMemberOf'
		'isCollaboratorOf'
	]

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
			]
			readonly: [ /^temp/	]

		for type in @relationTypes
			relationType = config.get('personRelationTypes')[type]

			schema["timbuctoo-relation.#{type}"] =
				type: 'Relation'
				relationTypeDescription:
					relationTypeVariation: config.get 'relationTypeVariation'
					targetType: relationType.targetTypeName
					relationTypeId: relationType._id

		_.extend schema['timbuctoo-relation.hasPersonLanguage'],
			title: 'Languages'
			options: config.get 'languages'
			
		_.extend schema['timbuctoo-relation.isMemberOf'],
			title: 'Memberships'
			options: config.get 'collectives'
			autocomplete: (value) -> simpleSearch value, 'wwcollective', 200

		_.extend schema['timbuctoo-relation.isCollaboratorOf'],
			title: 'Collaborations'
			options: config.get 'persons'
			autocomplete: (value) -> simpleSearch value, 'wwperson', 200

		@form = new Form
			className: 'timbuctoo-form'
			authToken: config.get 'authToken'
			VRE_ID: config.get 'VRE_ID'
			relationsUrl: config.relationsUrl()
			model: @model
			schema: schema
			fields: [
				'tempName'
				'names'
				'gender'
				'birthDate'
				'deathDate'
				'timbuctoo-relation.hasPersonLanguage'
				'types'
				'livedIn'
				'children'
				'timbuctoo-relation.isMemberOf'
				'timbuctoo-relation.isCollaboratorOf'
				'bibliography'
				'educations'
				'professions'
				'religions'
				'financials'
				'health'
				'nationality'
				'personalSituation'
				'links'
			]

		@$('.form').html @form.el

module.exports = Person