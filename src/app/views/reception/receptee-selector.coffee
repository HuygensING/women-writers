Backbone = require 'backbone'

config = require '../../config'

{createFacetedSearch} = require '../../helpers/search'

mainReceptionSearchTemplate = require '../../../templates/faceted-search/reception-main.jade'
documentFacetsSearchTemplate = require '../../../templates/faceted-search/document.jade'
personFacetsSearchTemplate = require '../../../templates/faceted-search/person.jade'

class RecepteeSelector extends Backbone.View
	template: require '../../../templates/views/reception/source-query-builder.jade'
	className: 'query-builder'
		
	initialize: (options={}) ->
		@facetValues = []
		@type = null

	createSearch: (type) ->
		@search?.destroy()

		options =
			collapsed: true
			templates:
				main: mainReceptionSearchTemplate

		if type is 'work'
			options.type = 'wwdocuments'
			options.templates.facets = documentFacetsSearchTemplate
			options.facetTitleMap = config.get 'documentFacetTitles'
			options.queryOptions =
				facetValues: [
					{ name: 'dynamic_b_is_source', values: ['false'] }
				]
				term: '*'
		else if @type is 'person'
			options.type = 'wwpersons'
			options.templates.facets = personFacetsSearchTemplate
			options.facetTitleMap = config.get 'personFacetTitles'

		@search = createFacetedSearch options
		@facetValues = []

		@listenTo @search, 'change:queryoptions', (queryOptions) =>
			@setValues queryOptions.get 'facetValues'
			@trigger 'change', queryOptions

		@search.search()
	
	setValues: (values) -> @facetValues = values
	
	# We don't want the boolean 'is source' facet,
	# because we're only interested in works
	getValues: -> f for f in @facetValues when not f.name.match /is_source/

	getQueryId: ->
		@search.getSearchResultURL().split('/').pop()

	render: ->
		@$el.html @template()
		@$('.search-container').append @search.el if @search?

	setType: (type) ->
		# Assumption here is that if the type is being changed
		# a completely clean slate is needed (to start searching
		# from scratch), so we might as well create a completely
		# new faceted search each time the type is changed
		if type isnt @type
			@type = type
			@createSearch type
			@render()

	hide: -> @$el.addClass 'hidden'
	show: -> @$el.removeClass 'hidden'

module.exports = RecepteeSelector