Backbone = require 'backbone'

SearchCreatorWrapper = require '../../helpers/search-creator-wrapper'
IdHelper = require '../../helpers/id-helper'

class ReceptionBaseSearch extends Backbone.View
	template: require '../../../templates/views/reception-faceted-search.jade'
	className: 'reception-searcher'
		
	events:
		'click .close-button' : 'closeEditor'
		
	initialize: (options = {}) ->
		@searchCreatorWrapper = options.searchCreatorWrapper ? new SearchCreatorWrapper()
		@idHelper = options.idHelper ? new IdHelper()
		@search = @searchCreatorWrapper.createSearch(@getTypeString(), @getQueryOptions(), @getFacetNameMap())
	
	render: (parentElement) ->
		@$el.html(@template())
		@$el.append(@search.$el)
		
		parentElement.append(@$el)
		
	show: () ->
		@$el.show()
	
	closeEditor: () ->
		@hide()
		@$el.trigger('queryBuilderCloseEvent')
	
	hide: () ->
		@$el.hide()
		
	getQueryOptions: () ->
		queryOptions =
			term: '*'
			resultRows: 0
			
	getSearchId: () ->
		return @idHelper.getIdFromUrl(@getLastPostUrlFromSearch())
		
	getLastPostUrlFromSearch: () ->
		lastPostURL = @search.model.searchResults.models.pop().postURL
		
		return lastPostURL
		
module.exports = ReceptionBaseSearch