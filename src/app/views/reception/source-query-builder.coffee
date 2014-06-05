Backbone = require 'backbone'

ReceptionSearchCreator = require '../../helpers/reception-search-creator'

class SourceQueryBuilder extends Backbone.View
	template: require '../../../templates/views/reception/source-query-builder.jade'
	className: 'reception-searcher'
		
	initialize: (options= {}) ->
		@receptionSearchCreator = options.receptionSearchCreator ? new ReceptionSearchCreator()
		
	events:
		'click .close-button': 'handleCloseButtonClick'
		'click [name="source-type"]': 'sourceTypeSelected'
		'sourceTypeSelectedEvent': 'renderSearch'
	
	render: (parentElement) ->
		@$el.html(@template())
		
		parentElement.append(@$el)
	
	handleCloseButtonClick: () ->
		@hide()
		@$el.trigger('queryBuilderCloseEvent')
	
	hide: () ->
		@$el.hide()
		
	show: () ->
		@$el.show()
	
	sourceTypeSelected: (e) ->
		value = e.currentTarget.value
		
		@$el.trigger('sourceTypeSelectedEvent', value)
		
	renderSearch: (e, value) ->
		@receptionSearch = @receptionSearchCreator.create(value)
				
		@receptionSearch.render(@$el)
		@receptionSearch.show()
		
	getSearchId: () ->
		return @receptionSearch.getSearchId()
	
module.exports = SourceQueryBuilder