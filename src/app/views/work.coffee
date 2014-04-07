Backbone = require 'backbone'

config = require '../config.coffee'

workDescription = require '../../data/metadata/wwdocument.json'
Form = require 'timbuctoo-edit-forms/src/coffee/views/form.coffee'

StatusIndicator = require './status'

{searchQuery, simpleSearch} = require '../helpers/search'

{createTimbuctooSchema}  = require 'timbuctoo-edit-forms/src/coffee/helpers.coffee'


class Work extends Backbone.View
	className: 'work-edit'
	template: require '../../templates/views/work.jade'

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

		#reception of
		workReceptions = _.filter config.get('receptions'), (r) -> r.baseSourceType is 'document'
		#TODO: received in

		autocompleteFactory = (relationType) ->
			# TODO inverse name for received in
			type = _.findWhere workReceptions, (r) -> r.regularName is relationType
			typeString = type.derivedTargetType
			# Only search for documents from this particular VRE

			query = (value) -> simpleSearch value, typeString, 5000

			query

		schema['timbuctoo-relation.receptions'] =
			type: 'DynamicRelations'
			title: 'Receptions'
			relationTypes: workReceptions
			relationTypeVariation: config.get 'relationTypeVariation'
			relationName: 'reception'
			autocompleteFactory: autocompleteFactory

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
						'timbuctoo-relation.receptions'
					]
				}
			]
			
		@$('.form').html @form.el

module.exports = Work