Backbone = require 'backbone'
FacetedSearch = require 'faceted-search'

config = require '../config.coffee'

createFacetedSearch = (queryOptions, facetNameMap={}, textSearchTitle) ->
	new FacetedSearch
		baseUrl: config.get 'baseUrl'
		searchPath: config.get 'searchPath'
		requestOptions:
			headers:
				VRE_ID: config.get 'VRE_ID'
		queryOptions: queryOptions
		facetNameMap: facetNameMap
		textSearchTitle: textSearchTitle

searchQuery = (args) ->
	{query, options} = args

	deferred = Backbone.$.Deferred()

	req = Backbone.$.ajax
		type: 'POST'
		url: options.searchUrl
		data: JSON.stringify query
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

simpleSearch = (term, type, limit=500) ->
	escaped = escapeTerm term
	searchQuery
		query:
			term: "*#{escaped}*"
			typeString: type
		options:
			searchUrl: config.searchUrl()
			resultRows: limit

escapeTerm = (term) ->
	special = '+ - & | ! ( ) { } [ ] ^ " ~ * ? : \ '.split /\s+/
	escaped = term

	for char in special
		escaped = term.replace /#{char}/g, '\\' + char 

	escaped

module.exports =
	createFacetedSearch: createFacetedSearch
	searchQuery: searchQuery
	simpleSearch: simpleSearch
	escapeTerm: escapeTerm