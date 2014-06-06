Backbone = require 'backbone'

ReceptionSearchCreator = require '../../helpers/reception-search-creator'

class SourceQueryBuilder extends Backbone.View
	template: require '../../../templates/views/reception/source-query-builder.jade'
	className: 'query-builder'
		
	initialize: (options= {}) ->
		@receptionSearchCreator = options.receptionSearchCreator ? new ReceptionSearchCreator()
		@eventBus = options.eventBus
		
		@eventBus.on('sourceTypeSelectedEvent', (data) =>
			@renderSearch(data)
		)
		
	events:
		'click .close-button': 'handleCloseButtonClick'
		'click [name="source-type"]': 'sourceTypeSelected'
		
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
		
		@eventBus.trigger('sourceTypeSelectedEvent', value)
		
	renderSearch: (value) ->
		if @receptionSearch?
			@receptionSearch.remove()
		
		@receptionSearch = @receptionSearchCreator.create(value)
				
		@receptionSearch.render(@$el)
		@receptionSearch.show()
		
	getSearchId: () ->
		return @receptionSearch.getSearchId()
module.exports = SourceQueryBuilder