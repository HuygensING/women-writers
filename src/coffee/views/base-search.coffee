Backbone = require 'backbone'
_ = require 'underscore'
$ = Backbone.$

searchTemplate = require '../../jade/views/search.jade'
resultsTemplate = require '../../jade/views/search-results.jade'

{createFacetedSearch} = require '../helpers/search.coffee'

config = require '../config'
user = require '../models/user'

class SearchView extends Backbone.View
	template: searchTemplate
	resultsTemplate: resultsTemplate

	events:
		'click .cursor .next': 'nextResults'
		'click .cursor .prev': 'prevResults'
		'change .order-by select': 'sortResults'

	initialize: (@options={}) ->
		_.extend @, Backbone.Events

		@type = @options.type ? @type
		@textSearchTitleMap = @options.textSearchTitleMap ? @textSearchTitleMap
		@queryOptions = @options.queryOptions ? @queryOptions
		@facets = @options.facets ? @facets
		@facetTitleMap = @options.facetTitleMap ? @facetTitleMap
		@sortableFieldsMap = (@options.sortableFieldsMap ? @sortableFieldsMap) ? {}
		@startCollapsed = @options.startCollapsed ? @startCollapsed
		@fsTemplates = @options.templates ? @fsTemplates

		@search = createFacetedSearch
			type: @type
			queryOptions: @queryOptions
			facets: @facets
			facetTitleMap: @facetTitleMap
			textSearchTitleMap: @textSearchTitleMap
			collapsed: @startCollapsed
			templates: @fsTemplates

		# Hide facets menu and show when results are loaded for the first time.
		@search.$el.find('.facets-menu').hide()
		@listenToOnce @search, 'change:results', (results) =>
			@search.$el.find('.facets-menu').show()
		# /Hide facets menu

		@listenTo @search, 'change:results', (results) =>
			config.set currentResultIds: results.get 'ids'
			@renderResults results

	nextResults: ->
		@showLoader()
		@search.next()

	prevResults: ->
		@showLoader()
		@search.prev()

	sortResults: (e) -> # TODO: Dropdown
		oldSortField = @sortField
		@sortField = $(e.currentTarget).val()
		if @sortField isnt oldSortField
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
		byId = {}
		byId[r._id] = r for r in rsp.get('results')

		@$('.results').html @resultsTemplate
			response: rsp.attributes
			sortableFieldsMap: @sortableFieldsMap
			objectUrl: @objectUrl
			config: config
			sortedBy: @sortField
			showCurated: (o) ->
				isCurated = byId[o.id]['^modified'].userId isnt 'importer'
				isCurated and user.get('loggedIn') is true

		@$('.cursor .loader').hide()
		@$('.cursor .position').show()
		@displayLoader = false

		@$('.cursor .next').toggle @search.hasNext()
		@$('.cursor .prev').toggle @search.hasPrev()

		@$('.results').css 'counter-reset', "li-result #{rsp.attributes.start}"

	render: ->
		@$el.html @template()
		@$('.search').html @search.el
		# @$('.results').text 'No results'

		@search.search()

module.exports = SearchView