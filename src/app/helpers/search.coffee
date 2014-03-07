Backbone = require 'backbone'
FacetedSearch = require 'faceted-search'

config = require '../config.coffee'

createFacetedSearch = (queryOptions, facetNameMap={}) ->
	new FacetedSearch
		baseUrl: config.get 'baseUrl'
		searchPath: config.get 'searchPath'
		requestOptions:
			headers:
				VRE_ID: config.get 'VRE_ID'
		queryOptions: queryOptions
		facetNameMap: facetNameMap

module.exports =
	createFacetedSearch: createFacetedSearch