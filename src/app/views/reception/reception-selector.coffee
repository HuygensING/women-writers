Backbone = require 'backbone'

config = require '../../config'

{createFacetedSearch} = require '../../helpers/search'

mainReceptionSearchTemplate = require '../../../templates/faceted-search/reception-main.jade'
documentFacetsSearchTemplate = require '../../../templates/faceted-search/document.jade'

class ReceptionSelector extends Backbone.View
	template: require '../../../templates/views/reception/reception-selector.jade'

	initialize: (options = {}) ->
		@search = createFacetedSearch
			type: 'wwdocuments'
			collapsed: true
			facetTitleMap: config.get 'documentFacetTitles'
			templates:
				main: mainReceptionSearchTemplate
				facets: documentFacetsSearchTemplate

		@facetValues = []

		@listenTo @search, 'change:queryoptions', (queryOptions) =>
			@setValues queryOptions.get 'facetValues'
			@trigger 'change', queryOptions
		@listenTo @search, 'change:results', =>
			@trigger 'change:results'

		@search.search()

	setValues: (values) -> @facetValues = values
	getValues: -> @facetValues

	getQueryId: ->
		@search.getSearchResultURL().split('/').pop()

	render: ->
		@$el.html @template()
		@$('.search-container').html @search.el

	hide: -> @$el.addClass 'hidden'
	show: -> @$el.removeClass 'hidden'

	getSearchId: () ->
		return @search.getSearchId()
	
module.exports = ReceptionSelector