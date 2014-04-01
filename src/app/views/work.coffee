Backbone = require 'backbone'

config = require '../config.coffee'

workDescription = require '../../data/metadata/wwdocument.json'
Form = require 'timbuctoo-edit-forms/src/coffee/views/form.coffee'

{searchQuery, simpleSearch} = require '../helpers/search'

{createTimbuctooSchema}  = require 'timbuctoo-edit-forms/src/coffee/helpers.coffee'


class Work extends Backbone.View
	className: 'work-edit'
	template: require '../../templates/views/work.jade'

	relationTypes: [
		'hasLanguage'
		'hasPublishLocation'
		'isCreatedBy'
	]
	
	events:
		'click .save': 'saveWork'
	
	saveWork: ->
		@form.save()

	events:
		'click .save': 'save'

	initialize: ->
		@render() if @model?
		
	save: ->
		@form.save()

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
					targetType: relationType.targetTypeName
					relationTypeId: relationType._id

		_.extend schema['timbuctoo-relation.hasLanguage'],
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

		workReceptions = _.filter config.get('receptions'), (r) -> r.source is 'document'

		autocompleteFactory = (targetType) ->
			workRelationTypes = config.get 'workRelationTypes'
			type = workRelationTypes[targetType]
			typeString = type.targetTypeName
			console.log "Type >#{targetType}< #{typeString}", type, workRelationTypes
			# Only search for documents from this particular VRE
			typeString = 'wwdocument' if typeString is 'document'

			query = (value) ->
				simpleSearch(value, typeString, 5000)

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
						'timbuctoo-relation.hasLanguage'
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