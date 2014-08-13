Backbone = require 'backbone'
BaseSearch = require '../base-search.coffee'

config = require '../../config.coffee'

class DocumentSearch extends BaseSearch
	resultsTemplate: require '../../../templates/views/document/document-search-results.jade'
	type: 'wwdocuments'
	queryOptions:
		term: '*'
		facetValues: [
			{
				name: 'dynamic_b_is_source'
				values: ['false']
			}
		]
		typeString: config.get 'documentTypeString'
	resultRows: 25
	facetTitleMap:
		dynamic_s_date: 'Year of first publication'
		dynamic_s_origin: 'Origin'
		dynamic_s_document_type: 'Document Type'
		dynamic_s_creator: 'Creator'
		dynamic_s_language: 'Language'
		dynamic_s_subject: 'Subject'
		dynamic_s_genre: 'Genre'
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