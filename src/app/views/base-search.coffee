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

	events:
		'click .cursor .next': 'nextResults'
		'click .cursor .prev': 'prevResults'

	initialize: (@options={}) ->
		_.extend @, Backbone.Events

		@queryOptions = @options.queryOptions ? @queryOptions
		@facetNameMap = @options.facetNameMap ? @facetNameMap

		@search = createFacetedSearch @queryOptions, @facetNameMap

		@listenTo @search, 'results:change', (results) => @renderResults results

	nextResults: ->
		@showLoader()
		@search.next()

	prevResults: ->
		@showLoader()
		@search.prev()

	sortResults: (e) -> # TODO: Dropdown
		@sortField = $(e.currentTarget).val()
		@search.sortResultsBy(@sortField)

	resetSearch: -> # TODO: Create button
		@search.reset()

	showLoader: ->
		@displayLoader = true
		doIt = =>
			if @displayLoader
				@$('.cursor .position').hide()
				@$('.cursor .loader').fadeIn 150
		_.delay doIt, 200

	renderResults: (rsp) ->
		@$('.results').html @resultsTemplate
			response: rsp.attributes
			objectUrl: @objectUrl
			config: config

		@$('.cursor .loader').hide()
		@$('.cursor .position').show()
		@displayLoader = false

		@$('.cursor .next').toggle @search.hasNext()
		@$('.cursor .prev').toggle @search.hasPrev()

	render: ->
		@$el.html @template()
		@$('.search').html @search.el
		@$('.results').text 'No results'

module.exports = SearchView