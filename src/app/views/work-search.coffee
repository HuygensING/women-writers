Backbone = require 'backbone'
BaseSearch = require './base-search.coffee'

config = require '../config.coffee'

class WorkSearch extends BaseSearch
	resultsTemplate: require '../../templates/views/work-search-results.jade'
	queryOptions:
		term: '*'
		typeString: config.get 'workTypeString'
		resultRows: 25
	facetNameMap:
		dynamic_s_date: 'Date'
		dynamic_s_origin: 'Origin'
		dynamic_s_document_type: 'Document Type'
	sortableFieldsMap:
		dynamic_s_creator: 'Creator'
		dynamic_s_title: 'Title'

	initialize: (@options) ->
		super
		@render()

module.exports = WorkSearch