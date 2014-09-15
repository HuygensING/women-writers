Backbone = require 'backbone'
_ = require 'underscore'

config = require '../../config.coffee'

personDescription = require '../../../data/metadata/wwperson.json'
Form = require 'timbuctoo-edit-forms/src/coffee/views/form.coffee'

StatusIndicator = require '../status'

{createTimbuctooSchema}  = require 'timbuctoo-edit-forms/src/coffee/helpers.coffee'
{searchQuery, simpleSearch} = require '../../helpers/search'

DynamicRelationTypeHelper = require 'timbuctoo-edit-forms/src/coffee/helpers/dynamic-relation-type-helper'
DynamicInverseRelationTypeHelper = require 'timbuctoo-edit-forms/src/coffee/helpers/dynamic-inverse-relation-type-helper'

onlyRealPeople = ['AUTHOR', 'ARCHETYPE', '(empty)']

class Person extends Backbone.View
	className: 'person-edit'
	template: require '../../../templates/views/person/edit.jade'

	relationTypes: [
		'hasBirthPlace'
		'hasDeathPlace'
		'hasEducation'
		'hasFinancialSituation'
		'hasMaritalStatus'
		'isSpouseOf'
		'hasPseudonym'
		'hasProfession'
		'hasReligion'
		'hasSocialClass'
		'isCreatorOf'
		'isCollaboratorOf'
		'isMemberOf'
		'isPseudonymOf'
	]

	events:
		'click .save': 'save'

	initialize: ->
		@render() if @model?
		
		@model.on 'sync', =>
			@render()

	save: ->
		status = new StatusIndicator

		{result, errors} = @form.save()

		if not errors?
			status.show().loading()
			result.error =>
				status.show().error()
			result.done =>
				@model.fetch().done =>
					status.show().success =>
						config.router().navigate config.personViewPath(@model.id), trigger: true
		else
			margin = 100
			{top} = @$('.field.error').first().offset()
			Backbone.$('html, body').animate scrollTop: top - margin

	render: ->
		@$el.html @template
			config: config
			person: @model.attributes
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

		_.extend schema['gender'],
			options: schema['gender'].options.map (o) -> 
				val: o, label: config.mapGenderOption o

		for type in @relationTypes
			relationType = config.get('personRelationTypes')[type]

			schema["timbuctoo-relation.#{type}"] =
				type: 'Relation'
				relationTypeDescription:
					relationTypeVariation: config.get 'relationTypeVariation'
					typeId: relationType._id
					baseSourceType: relationType.sourceTypeName
					baseTargetType: relationType.targetTypeName
					
		_.extend schema['timbuctoo-relation.hasBirthPlace'],
			title: 'Birth place'
			options: config.get 'locations'
			autocomplete: (value) -> simpleSearch value, 'wwlocation'
			relationTypeHelper: new DynamicRelationTypeHelper()
			onlyOne: true
			placeholderString: 'Location'
			
		_.extend schema['timbuctoo-relation.hasDeathPlace'],
			title: 'Death place'
			options: config.get 'locations'
			autocomplete: (value) -> simpleSearch value, 'wwlocation'
			relationTypeHelper: new DynamicRelationTypeHelper()
			onlyOne: true
			placeholderString: 'Location'
			
		_.extend schema['timbuctoo-relation.hasEducation'],
			title: 'Education'
			options: config.get 'educations'
			relationTypeHelper: new DynamicRelationTypeHelper()
						
		_.extend schema['timbuctoo-relation.hasFinancialSituation'],
			title: 'Financials'
			options: config.get 'financialSituations'
			relationTypeHelper: new DynamicRelationTypeHelper()
		
		_.extend schema['timbuctoo-relation.hasMaritalStatus'],
			title: 'Marital status'
			options: config.get 'maritalStatuses'
			relationTypeHelper: new DynamicRelationTypeHelper()
			
		_.extend schema['timbuctoo-relation.hasProfession'],
			title: 'Profession'
			options: config.get 'professions'
			relationTypeHelper: new DynamicRelationTypeHelper()
			
		_.extend schema['timbuctoo-relation.hasReligion'],
			title: 'Religion'
			options: config.get 'religions'
			relationTypeHelper: new DynamicRelationTypeHelper()
			
		_.extend schema['timbuctoo-relation.hasSocialClass'],
			title: 'Social class'
			options: config.get 'socialClasses'
			relationTypeHelper: new DynamicRelationTypeHelper()
			
		_.extend schema['timbuctoo-relation.isMemberOf'],
			title: 'Memberships'
			options: config.get 'collectives'
			autocomplete: (value) -> simpleSearch value, 'wwcollective'
			relationTypeHelper: new DynamicRelationTypeHelper()
			placeholderString: 'Collective'

		# Assuming collaborations can only be with real people
		_.extend schema['timbuctoo-relation.isCollaboratorOf'],
			title: 'Collaborations'
			options: config.get 'persons'
			autocomplete: (value) ->
				simpleSearch value, 'wwperson', 500,
					facetValues: [
						{ name: 'dynamic_s_types', values: onlyRealPeople }
					]
			relationTypeHelper: new DynamicRelationTypeHelper()
			placeholderString: 'Person'

		_.extend schema['timbuctoo-relation.isCreatorOf'],
			title: 'Is creator of'
			options: config.get 'documents'
			autocomplete: (value) -> simpleSearch value, 'wwdocument'
			relationTypeHelper: new DynamicInverseRelationTypeHelper()
			placeholderString: 'Work'

		_.extend schema['timbuctoo-relation.hasPseudonym'],
			title: 'Has pseudonym'
			options: config.get 'persons'
			autocomplete: (value) ->
				simpleSearch value, 'wwperson', 500,
					facetValues: [
						{ name: 'dynamic_s_types', values: ['PSEUDONYM'] }
					]
			relationTypeHelper: new DynamicInverseRelationTypeHelper()
			placeholderString: 'Pseudonym'

		_.extend schema['timbuctoo-relation.isPseudonymOf'],
			title: 'Is pseudonym of'
			options: config.get 'persons'
			autocomplete: (value) -> simpleSearch value, 'wwperson', 500,
				facetValues: [
					{ name: 'dynamic_s_types', values: onlyRealPeople }
				]
			relationTypeHelper: new DynamicRelationTypeHelper()
			placeholderString: 'Person'

		_.extend schema['timbuctoo-relation.isSpouseOf'],
			title: 'Is spouse of'
			autocomplete: (value) -> simpleSearch value, 'wwperson', 500
			relationTypeHelper: new DynamicRelationTypeHelper()
			placeholderString: 'Person'

		# customize field type
		schema.notes.type = 'TextArea'
		schema.personalSituation.type = 'TextArea'

		schema['birthDate'].validators = ['datable']
		schema['deathDate'].validators = ['datable']

		@form = new Form
			className: 'timbuctoo-form'
			authToken: config.get 'authToken'
			VRE_ID: config.get 'VRE_ID'
			relationsUrl: config.relationsUrl()
			model: @model
			schema: schema
			fieldsets: [
				{
					fields: [
						'tempOldId'
						'tempName'
						'tempSpouse'
						'names'
						'gender'
						'types'
						'tempPseudonyms'
						'timbuctoo-relation.hasPseudonym'
						'timbuctoo-relation.isPseudonymOf'
					]
				}
				{
					legend: 'Notes'
					collapsed: false
					fields:  ['notes']
				}
				{
					legend: 'Personal situation'
					collapsed: false
					fields: [
						'personalSituation'
					]
				}
				{
					legend: 'Dates and Places'
					collapsed: true
					fields: [
						'birthDate'
						'deathDate'
						'tempBirthPlace'
						'tempPlaceOfBirth'
						'timbuctoo-relation.hasBirthPlace'
						'livedIn'
						'tempDeathPlace'
						'timbuctoo-relation.hasDeathPlace'
						'nationality'
					]

				}
				{
					legend: 'Personal'
					collapsed: true
					fields: [
						'timbuctoo-relation.hasMaritalStatus'
						'tempSpouse'
						'timbuctoo-relation.isSpouseOf'
						'tempChildren'
						'tempPsChildren'
						'children'
						'timbuctoo-relation.hasSocialClass'
						'timbuctoo-relation.hasEducation'
						'timbuctoo-relation.hasReligion'
						'health'
					]
				}

				{
					legend: 'Public'
					collapsed: true
					fields: [
						'tempFinancialSituation'
						'timbuctoo-relation.hasProfession'
						'tempCollaborations'
						'timbuctoo-relation.isCollaboratorOf'
						'timbuctoo-relation.hasFinancialSituation'
						'tempMemberships'
						'timbuctoo-relation.isMemberOf'
					]
				}
				{
					legend: 'Other'
					collapsed: true
					fields: [
						'bibliography'
						'links'
					]
				}
				{
					legend: 'Works'
					collapsed: true
					fields: [
						'timbuctoo-relation.isCreatorOf'
					]
				}
			]

		@$('.form').html @form.el

module.exports = Person