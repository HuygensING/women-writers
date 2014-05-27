Backbone = require 'backbone'

SearchCreatorWrapper = require '../helpers/search-creator-wrapper'

class ReceptionBaseSearch extends Backbone.View
	template: require '../../templates/views/reception-faceted-search.jade'
	className: 'reception-searcher'
		
	events:
		'click .close-button' : 'hide'
		
	initialize: (options = {}) ->
		@searchCreatorWrapper = options.searchCreatorWrapper ? new SearchCreatorWrapper()
		@search = @searchCreatorWrapper.createSearch(@getTypeString(), @getQueryOptions(), @getFacetNameMap())
		
		console.log('search', @search)
		
	render: (parentElement) ->
		@$el.html(@template())
		@$el.append(@search.$el)
		
		parentElement.append(@$el)
		
	show: ->
		@$el.show()
		
	hide: ->
		@$el.hide()
		
	getQueryOptions: () ->
		queryOptions =
			term: '*'
			resultRows: 0
			
	getSearchId: () ->
		return @search.model.id
module.exports = ReceptionBaseSearch