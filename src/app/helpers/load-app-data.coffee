# This module loads data needed for the app to start running:
# source and reception data. It returns a promise that resolves
# once all data is loaded

Backbone = require 'backbone'
$ = Backbone.$ = require 'jquery'

config = require '../config'
user = require '../models/user'

{searchQuery} = require './search'

module.exports = ->
	loadedReceptions = new $.Deferred()
	$.getJSON(config.receptionsUrl()).then (data) ->
		config.set receptions: data.receptions
		loadedReceptions.resolve()

	loadedSources = new $.Deferred()
	searchQuery
		query:
			term: '*'
			facetValues: [
				{ name: 'dynamic_b_is_source', values: ['true'] }
			]
		options:
			searchUrl: config.searchUrl('wwdocuments')
			resultRows: 5000 # 311 sources at time of writing, not likely to grow substantially
	.then (data) ->
		byId = _.groupBy data.results, (r) -> r._id
		config.set sources: (id: s.id, title: s.displayName, notes: byId[s.id][0].notes for s in data.refs)
		loadedSources.resolve()


	# Fetch a resource, set the given config key with the data (id, label)
	loadPromise = (url, key) ->
		promise = new $.Deferred()
		$.getJSON(url).then (data) ->
			config.set key, (value: el._id, label: el.value for el in data)
			promise.resolve()
		promise
	loadedSourceCategories = loadPromise config.sourceCategoryUrl(), 'sourceCategories'

	return $.when(
		loadedReceptions,
		loadedSources,
		loadedSourceCategories
	)