Backbone = require 'backbone'
FacetedSearch = require 'huygens-faceted-search/src/coffee/main'

facetedSearchMainTemplate = require '../../templates/faceted-search/main.jade'

config = require '../config'

facetPlaceholderList = (facets) -> ("<div class='#{f}-placeholder'></div>" for f in facets)

createFacetedSearch = (searchCfg={}) ->
	{queryOptions, facetTitleMap, textSearchTitle, resultRows, collapsed, templates} = searchCfg

	collapsed ?= true

	options =
		baseUrl: config.get 'baseUrl'
		searchPath: config.searchPath(searchCfg.type)
		requestOptions:
			headers:
				VRE_ID: config.get 'VRE_ID'
		queryOptions: queryOptions
		resultRows: config.get 'resultRows'
		facetTitleMap: facetTitleMap
		startCollapsed: collapsed
		textSearchTitle: textSearchTitle
		autoSearch: true
		templates:
			main: facetedSearchMainTemplate

	_.extend options.templates, templates if templates?

	new FacetedSearch options


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
			VRE_ID: options.vreId || config.get 'VRE_ID'

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

simpleSearch = (term, type, limit=500, queryOptions={}) ->
	escaped = escapeTerm term
	_.defaults queryOptions,
		term: "*#{escaped}*"
		typeString: type

	searchQuery
		query: queryOptions
		options:
			searchUrl: config.searchUrl(type + 's')
			resultRows: limit

searchLocation = (term, type='location', limit=500, vreId=config.get 'adminVreId') ->
	escaped = escapeTerm term
	queryOptions =
		term: "*#{escaped}*"
		typeString: type

	searchQuery
		query: queryOptions
		options:
			searchUrl: config.searchUrl(type + 's')
			resultRows: limit
			vreId: vreId

escapeTerm = (term) ->
	special = '+ - & | ! ( ) { } [ ] ^ " ~ * ? : \ '.split /\s+/
	escaped = term

	for char in special
		escaped = term.replace /#{char}/g, '\\' + char 

	escaped

module.exports =
	createFacetedSearch: createFacetedSearch
	searchQuery: searchQuery
	searchLocation: searchLocation
	simpleSearch: simpleSearch
	escapeTerm: escapeTerm