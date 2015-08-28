Backbone = require 'backbone'

SearchCreatorWrapper = require '../../helpers/search-creator-wrapper'

class ReceptionBaseSearch extends Backbone.View
	className: 'query-builder'
		
	initialize: (options = {}) ->

		_.extend @, Backbone.Events

		@searchCreatorWrapper = options.searchCreatorWrapper ? new SearchCreatorWrapper()
		@search = @searchCreatorWrapper.createSearch(@getTypeString(), @getQueryOptions(), @getFacetNameMap())

		@search.search()

		@listenTo @search, 'change:results', (result) =>
			console.log "OMF", @extractValues(result)

	extractValues: (result) ->
		selected = {}
		selected[f.name] = f.options for f in result.get('facets')

		selected

	render: (parentElement) ->
		@$el.append(@search.$el)
		parentElement.append(@$el)

	show: ->
		@$el.show()

	hide: ->
		@$el.hide()

	getQueryOptions: ->
		queryOptions =
			term: '*'
			resultRows: 100
			
	getSearchId: () ->
		id = @getLastPostUrlFromSearch().split('/').reverse()[0]

	getLastPostUrlFromSearch: () ->
		models = @search.model.searchResults.models
		lastPostURL = models[(models.length - 1)].postURL
		
		return lastPostURL
		
module.exports = ReceptionBaseSearch