Backbone = require 'backbone'
FacetedSearch = require 'huygens-faceted-search/src/coffee/main'

facetedSearchMainTemplate = require '../../templates/faceted-search/main.jade'

config = require '../config.coffee'

facetPlaceholderList = (facets) -> ("<div class='#{f}-placeholder'></div>" for f in facets)

createFacetedSearch = (searchCfg={}) ->
	{queryOptions, facetTitleMap, textSearchTitle, resultRows, collapsed, templates} = searchCfg

	collapsed ?= true

	console.log "searchPath", config.get('searchPath') + searchCfg.type

	options =
		baseUrl: config.get 'baseUrl'
		searchPath: config.searchPath(searchCfg.type)
		requestOptions:
			headers:
				VRE_ID: config.get 'VRE_ID'
		queryOptions: queryOptions
		resultRows: resultRows ? config.get 'resultRows'
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