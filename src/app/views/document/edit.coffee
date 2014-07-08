Backbone = require 'backbone'

config = require '../../config.coffee'

documentDescription = require '../../../data/metadata/wwdocument.json'
Form = require 'timbuctoo-edit-forms/src/coffee/views/form.coffee'

StatusIndicator = require '../status'

{simpleSearch} = require '../../helpers/search'
DynamicRelationTypeHelper = require 'timbuctoo-edit-forms/src/coffee/helpers/dynamic-relation-type-helper'
DynamicInverseRelationTypeHelper = require 'timbuctoo-edit-forms/src/coffee/helpers/dynamic-inverse-relation-type-helper'

{createTimbuctooSchema}  = require 'timbuctoo-edit-forms/src/coffee/helpers.coffee'


class Document extends Backbone.View
	className: 'document-edit'
	template: require '../../../templates/views/document/edit.jade'
	receptionOf: 'timbuctoo-relation.receptionOf'
	receivedIn: 'timbuctoo-relation.receivedIn'

	relationTypes: [
		'hasDocumentSource'
		'hasWorkLanguage'
		'hasPublishLocation'
		'hasSourceCategory'
		'isCreatedBy'
	]
	
	events:
		'click .save': 'save'
		'click .cancel': 'cancel'
	
	save: ->
		status = new StatusIndicator

		{result, errors} = @form.save()

		if not errors?
			status.show().loading()
			result.error =>
				status.show().error()
			result.done =>
				@model.fetch().done => status.show().success()
		else
			margin = 100
			{top} = @$('.field.error').first().offset()
			Backbone.$('html, body').animate scrollTop: top - margin

	initialize: ->
		@render()
		@model.on 'sync', =>
			@render()

	render: ->
		@$el.html @template
			config: config
			document: @model.attributes
		schema = createTimbuctooSchema documentDescription,
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
		
			relationType = config.get('documentRelationTypes')[type]

			schema["timbuctoo-relation.#{type}"] =
				type: 'Relation'
				relationTypeDescription:
					relationTypeVariation: config.get 'relationTypeVariation'
					baseSourceType: relationType.sourceTypeName
					baseTargetType: relationType.targetTypeName
					typeId: relationType._id

		_.extend schema['timbuctoo-relation.hasWorkLanguage'],
			title: 'Language'
			options: config.get 'languages'
			onlyOne: true
			relationTypeHelper: new DynamicRelationTypeHelper()

		_.extend schema['timbuctoo-relation.hasPublishLocation'],
			title: 'Publish location'
			options: config.get 'locations'
			onlyOne: true
			relationTypeHelper: new DynamicRelationTypeHelper()
			
		_.extend schema['timbuctoo-relation.hasSourceCategory'],
			title: 'Has source categories'
			onlyOne: false
			options: config.get 'sourceCategories'
			relationTypeHelper: new DynamicRelationTypeHelper()
			
		_.extend schema['timbuctoo-relation.hasDocumentSource'],
			title: 'Has sources'
			onlyOne: false
			autocomplete: (value) -> simpleSearch value, 'wwdocument', 5000
			relationTypeHelper: new DynamicRelationTypeHelper()
			placeholderString: 'Sources'

		_.extend schema['timbuctoo-relation.isCreatedBy'],
			title: 'Creator'
			options: config.get 'persons'
			onlyOne: false
			autocomplete: (value) -> simpleSearch value, 'wwperson', 5000
			relationTypeHelper: new DynamicRelationTypeHelper()
			placeholderString: 'Persons'

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

		schema['date'].validators = ['datable']

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
						'englishTitle'
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
						'source'
						'timbuctoo-relation.hasSourceCategory'
						'timbuctoo-relation.hasDocumentSource'
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

module.exports = Document