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

searchQuery = (args) ->
	{query, options} = args

	deferred = Backbone.$.Deferred()

	req = Backbone.$.ajax
		type: 'POST'
		url: options.searchUrl
		data: JSON.stringify(query)
		dataType: 'text'
		contentType: 'application/json; charset=utf-8'
		headers:
			VRE_ID: config.get 'VRE_ID'

	req.done (data, textStatus, jqXHR) =>
		if jqXHR.status is 201
			locationUrl = jqXHR.getResponseHeader 'location'
			locationUrl += '?rows=' + options.resultRows if options.resultRows
			Backbone.$.getJSON(locationUrl).done (data) ->
				deferred.resolve(data)

	req.fail (jqXHR, textStatus, errorThrown) =>
		console?.error 'Failed search', textStatus, errorThrown
		deferred.reject()

	deferred.promise()

module.exports =
	createFacetedSearch: createFacetedSearch
	searchQuery: searchQuery