Backbone = require 'backbone'

config = require '../config.coffee'

workDescription = require '../../data/metadata/wwdocument.json'
Form = require 'timbuctoo-edit-forms/src/coffee/views/form.coffee'

StatusIndicator = require './status'

{simpleSearch} = require '../helpers/search'
DynamicRelationTypeHelper = require 'timbuctoo-edit-forms/src/coffee/helpers/dynamic-relation-type-helper'
DynamicInverseRelationTypeHelper = require 'timbuctoo-edit-forms/src/coffee/helpers/dynamic-inverse-relation-type-helper'

{createTimbuctooSchema}  = require 'timbuctoo-edit-forms/src/coffee/helpers.coffee'


class Work extends Backbone.View
	className: 'work-edit'
	template: require '../../templates/views/work.jade'
	receptionOf: 'timbuctoo-relation.receptionOf'
	receivedIn: 'timbuctoo-relation.receivedIn'

	relationTypes: [
		'hasWorkLanguage'
		'hasPublishLocation'
		'isCreatedBy'
	]
	
	events:
		'click .save': 'save'
		'click .cancel': 'cancel'
	
	save: ->
		status = new StatusIndicator

		result = @form.save()

		status.show().loading()

		result.error => status.show().error()
		result.done =>
			@model.fetch().done => status.show().success()

	initialize: ->
		@render()
		@model.on 'sync', =>
			@render()

	render: ->
		@$el.html @template work: @model.attributes
		schema = createTimbuctooSchema workDescription,
			exclude: [
				/^[_@^]/
				'DELETED'
				'ID'
				'PID'
				'ROLES'
				'VARIATIONS'
				'names'
				'topoi'
				'resourceFormat'
				'resourceType'
				'rights'
				'description'
			]
			readonly: [ /^temp/	]

		schema['notes'].type = 'TextArea'

		for type in @relationTypes
			relationType = config.get('workRelationTypes')[type]

			schema["timbuctoo-relation.#{type}"] =
				type: 'Relation'
				relationTypeDescription:
					relationTypeVariation: config.get 'relationTypeVariation'
					sourceType: relationType.sourceTypeName
					targetType: relationType.targetTypeName
					relationTypeId: relationType._id

		_.extend schema['timbuctoo-relation.hasWorkLanguage'],
			title: 'Language'
			options: config.get 'languages'
			onlyOne: true

		_.extend schema['timbuctoo-relation.hasPublishLocation'],
			title: 'Publish location'
			options: config.get 'locations'
			onlyOne: true

		_.extend schema['timbuctoo-relation.isCreatedBy'],
			title: 'Creator'
			options: config.get 'persons'
			onlyOne: false
			autocomplete: (value) -> simpleSearch value, 'wwperson', 5000

		# reception of
		receivedInTypes = _.filter config.get('receptions'), (r) -> r.baseSourceType is 'document'
		# received in 
		receptionOfTypes = _.filter config.get('receptions'), (r) -> r.baseTargetType is 'document'
		
		autocompleteFactory = (relatedType) ->
			# Only search for documents from this particular VRE
			query = (value) -> simpleSearch value, relatedType, 5000
			
			query

		schema[@receptionOf] =
			type: 'DynamicRelations'
			title: 'Reception of'
			relationTypes: receptionOfTypes
			relationTypeVariation: config.get 'relationTypeVariation'
			relationName: 'reception'
			relationTypeHelper: new DynamicInverseRelationTypeHelper autocompleteFactory
			
		
		schema[@receivedIn] =
			type: 'DynamicRelations'
			title: 'Received in'
			relationTypes: receivedInTypes
			relationTypeVariation: config.get 'relationTypeVariation'
			relationName: 'reception'
			relationTypeHelper: new DynamicRelationTypeHelper autocompleteFactory

		@form = new Form
			className: 'timbuctoo-form'
			authToken: config.get 'authToken'
			VRE_ID: config.get 'VRE_ID'
			relationsUrl: config.relationsUrl()
			model: @model
			schema: schema
			fieldsets: [
				{
					legend: 'General'
					fields: [
						'title'
						'description'
						'tempCreator'
						'timbuctoo-relation.isCreatedBy'
						'tempLanguage'
						'timbuctoo-relation.hasWorkLanguage'
						'tempOrigin'
						'timbuctoo-relation.hasPublishLocation'
						'edition'
						'date'
						'documentType'
						'links'
						'reference'
						'notes'
					]
				}
				{
					legend: 'Receptions'
					fields: [
						@receptionOf
						@receivedIn
					]
				}
			]
			
		@$('.form').html @form.el

module.exports = Work