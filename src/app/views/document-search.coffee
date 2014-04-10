Backbone = require 'backbone'
BaseSearch = require './base-search.coffee'

config = require '../config.coffee'

class DocumentSearch extends BaseSearch
	resultsTemplate: require '../../templates/views/document-search-results.jade'
	queryOptions:
		term: '*'
		typeString: config.get 'documentTypeString'
		resultRows: 25
	facetNameMap:
		dynamic_s_date: 'Date'
		dynamic_s_origin: 'Origin'
		dynamic_s_document_type: 'Document Type'
		dynamic_s_creator: 'Creator'
		dynamic_s_language: 'Language'
		dynamic_s_subject: 'Subject'
	sortableFieldsMap:
		dynamic_sort_creator: 'Creator'
		dynamic_sort_title: 'Title'

	initialize: (@options) ->
		super
		@render()

module.exports = DocumentSearch