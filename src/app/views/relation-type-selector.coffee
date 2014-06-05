Backbone = require 'backbone'
RelationTypeMultiSelect = require './relation-type-multi-select'
ReceptionHelper = require '../helpers/reception-helper'

class RelationTypeSelector extends Backbone.View
	template: require '../../templates/views/relation-type-selector.jade'
	className: 'relation-type-selector'
	tagName: 'div'
	
	events: 
		'click.relation-type-selector .close-button':'closeEditor'
		'sourceTypeSelectedEvent': 'showRelationSelector'
		
	initialize: (options = {}) ->
		@relationTypeMultiSelect = if options.relationTypeMultiSelect? then options.relationTypeMultiSelect else new RelationTypeMultiSelect()
		@receptionHelper = if options.receptionHelper then options.receptionHelper else new ReceptionHelper()
	
	show: () ->
		@$el.show()
		
	render: (parentElement) ->
		@$el.html @template()
		
		@relationTypeMultiSelect.render()
		
		@$el.find('.relation-type-selector-content').append(@relationTypeMultiSelect.$el)
		
		parentElement.append(@$el)
	
	closeEditor: () ->
		@hide()
		@$el.trigger('queryBuilderCloseEvent')
	
	hide: () ->
		@$el.hide()
		
	showRelationSelector: (e, selectedSourceType) ->
		receptions = null
		
		if selectedSourceType is 'documents'
			receptions = @receptionHelper.getDocumentReceptions()
		else if selectedSourceType is 'persons'
			receptions = @receptionHelper.getPersonReceptions()
			
		@relationTypeMultiSelect.showWithOptions(receptions)
		

	getSelectedRelationTypeIds: () ->
		return @relationTypeMultiSelect.getSelectedRelationTypeIds()

module.exports = RelationTypeSelector