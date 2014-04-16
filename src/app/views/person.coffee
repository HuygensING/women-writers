Backbone = require 'backbone'
_ = require 'underscore'

config = require '../config.coffee'

personDescription = require '../../data/metadata/wwperson.json'
Form = require 'timbuctoo-edit-forms/src/coffee/views/form.coffee'

StatusIndicator = require './status'

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
		
		@model.on 'sync', =>
			@render()

	savePerson: ->
		status = new StatusIndicator

		result = @form.save()

		status.show().loading()

		result.error => status.show().error()
		result.done =>
			@model.fetch().done => status.show().success()

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
					relationTypeId: relationType._id
					sourceType: relationType.sourceTypeName
					targetType: relationType.targetTypeName

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
				'tempOldId'
				'tempName'
				'names'
				'gender'
				'birthDate'
				'tempBirthPlace'
				'tempPlaceOfBirth'
				'deathDate'
				'tempDeathPlace'
				'tempLanguages'
				'tempMotherTongue'
				'tempPublishingLanguages'
				'timbuctoo-relation.hasPersonLanguage'
				'types'
				'livedIn'
				'tempChildren'
				'tempPsChildren'
				'children'
				'tempSpouse'
				'tempMemberships'
				'timbuctoo-relation.isMemberOf'
				'tempCollaborations'
				'timbuctoo-relation.isCollaboratorOf'
				'bibliography'
				'educations'
				'professions'
				'religions'
				'tempFinancialSituation'
				'financials'
				'health'
				'nationality'
				'personalSituation'
				'links'
			]

		@$('.form').html @form.el

module.exports = Person