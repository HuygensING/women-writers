Backbone = require 'backbone'

ReceptionSearchCreator = require '../../helpers/reception-search-creator'

class ReceptionQueryBuilder extends Backbone.View
	template: require '../../../templates/views/reception/faceted-search.jade'
		
	initialize: (options = {}) ->
		@receptionSearchCreator = options.receptionSearchCreator ? new ReceptionSearchCreator()
		
		@search = @receptionSearchCreator.create('documents')
	
	render: (parentElement) ->
		@$el.html(@template())
		
		parentElement.append(@$el)
		
		@search.render(@$el)
		@search.show()
	
	handleCloseButtonClick: () ->
		@hide()
		
		@$el.trigger('queryBuilderCloseEvent')
	
	hide: () ->
		@$el.hide()
		
	show: () ->
		@$el.show()
		
	getSearchId: () ->
		return @search.getSearchId()
	
module.exports = ReceptionQueryBuilder