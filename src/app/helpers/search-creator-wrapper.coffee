# A class needed to test reception-document-searcher
	
class SearchCreatorWrapper
	
	constructor: (options = {}) ->
		if options.createFacetedSearch?
			@createFacetedSearch = (queryOptions, facetNameMap) ->
				options.createFacetedSearch(queryOptions, facetNameMap)
		else
			@createFacetedSearch = (queryOptions, facetNameMap) ->
				require('./search.coffee').createFacetedSearch(queryOptions, facetNameMap)
	
	createDocumentFacetedSearch: (queryOptions, facetNameMap) ->
		queryOptions.typeString = @getType('documentTypeString')
		@createFacetedSearch(queryOptions, facetNameMap)
		
	getType: (typeString) ->
		require('../config.coffee').get(typeString)

module.exports = SearchCreatorWrapper