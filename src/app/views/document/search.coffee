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
	facets: [
		'dynamic_s_date'
		'dynamic_s_origin'
		'dynamic_s_document_type'
		'dynamic_s_creator'
		'dynamic_s_language'
		'dynamic_s_subject'
		'dynamic_s_genre'
	]
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

	initialize: (@options) ->
		super
		@render()

module.exports = DocumentSearch