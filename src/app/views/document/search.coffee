Backbone = require 'backbone'
BaseSearch = require '../base-search.coffee'

config = require '../../config.coffee'

class DocumentSearch extends BaseSearch
	resultsTemplate: require '../../../templates/views/document/document-search-results.jade'
	type: 'wwdocuments'
	queryOptions:
		term: '*'
		typeString: config.get 'documentTypeString'
	resultRows: 25
	facetTitleMap: config.get 'documentFacetTitles'
	sortableFieldsMap:
		dynamic_sort_creator: 'Creator'
		dynamic_sort_title: 'Title'
	textSearchTitle: 'Title'
	fsTemplates:
		facets: require '../../../templates/faceted-search/document.jade'

	initialize: (@options) ->
		super
		@render()

module.exports = DocumentSearch