Backbone = require 'backbone'
BaseSearch = require '../base-search.coffee'

config = require '../../config.coffee'

class DocumentSearch extends BaseSearch
	resultsTemplate: require '../../../jade/views/document/document-search-results.jade'
	type: 'wwdocuments'
	queryOptions:
		term: '*'
		facetValues: [ # Only show works, not sources
			{
				name: 'dynamic_b_is_source'
				values: ['false']
			}
		]
		sortParameters: [
			fieldname: 'dynamic_sort_creator'
			direction: 'asc'
		]
		typeString: config.get 'documentTypeString'
	facetTitleMap: config.get 'documentFacetTitles'
	sortableFieldsMap:
		dynamic_sort_creator: 'Creator'
		dynamic_sort_title: 'Title'
	textSearchTitleMap: config.get 'textSearchTitles'
	fsTemplates:
		facets: require '../../../jade/faceted-search/document.jade'

	initialize: (@options) ->
		super
		@render()

module.exports = DocumentSearch