# A class needed to test reception-document-searcher

_ = require 'underscore'

{createFacetedSearch} = require './search.coffee'

config = require '../config'

class SearchCreatorWrapper
	createFacetedSearch: (options={}) ->
		_.extend options,
			collapsed: false
			templates:
				main: require '../../templates/faceted-search/reception-main.jade'

		createFacetedSearch options

	constructor: (options = {}) ->
		if options.createFacetedSearch?
			@createFacetedSearch = (queryOptions, facetTitleMap) ->
				options.createFacetedSearch(queryOptions, facetTitleMap)
				
	createSearch: (typeStringToFind, queryOptions, facetTitleMap) ->
		@createFacetedSearch
			type: @getType(typeStringToFind) + 's'
			queryOptions: queryOptions
			facetTitleMap: facetTitleMap
	
	getType: (typeString) ->
		config.get typeString

module.exports = SearchCreatorWrapper