Backbone = require 'backbone'
_ = require 'underscore'

FacetedSearch = require 'faceted-search'

searchTemplate = require '../../templates/views/search.jade'
resultsTemplate = require '../../templates/views/search-results.jade'

{createFacetedSearch} = require '../helpers/search.coffee'

config = require '../config.coffee'

class SearchView extends Backbone.View
	template: searchTemplate
	resultsTemplate: resultsTemplate
	initialize: (@options={}) ->
		_.extend @, Backbone.Events

		@queryOptions = @options.queryOptions ? @queryOptions
		@facetNameMap = @options.facetNameMap ? @facetNameMap

		@search = createFacetedSearch @queryOptions, @facetNameMap

		@listenTo @search, 'results:change', (results) => @renderResults results

	renderResults: (rsp) ->
		@$('.results').html @resultsTemplate
			response: rsp.attributes
			objectUrl: @objectUrl
			config: config

	render: ->
		@$el.html @template()
		@$('.search').html @search.el
		@$('.results').text 'No results'

module.exports = SearchView