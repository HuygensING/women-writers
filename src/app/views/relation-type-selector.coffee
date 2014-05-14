Backbone = require 'backbone'
RelationTypeMultiSelect = require './relation-type-multi-select'
ReceptionHelper = require '../helpers/reception-helper'

class RelationTypeSelector extends Backbone.View
	template: require '../../templates/views/relation-type-selector.jade'
	className: 'relation-type-selector'
	tagName: 'div'
	
	events: 
		'click.relation-type-selector .close-button':'hide'
		'click.relation-type-selector input[name="reception-type-source-type"]':'showRelationSelector'
		
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
	
	hide: () ->
		@$el.hide()
		
	showRelationSelector: (e) ->
		receptions = null
		
		if e.currentTarget.value is 'documents'
			receptions = @receptionHelper.getDocumentReceptions()
		else if e.currentTarget.value is 'persons'
			receptions = @receptionHelper.getPersonReceptions()
			
		@relationTypeMultiSelect.showWithOptions(receptions)
		

module.exports = RelationTypeSelector