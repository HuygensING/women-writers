Backbone = require 'backbone'
BaseSearch = require './base-search.coffee'

config = require '../config.coffee'

class WorkSearch extends BaseSearch
	resultsTemplate: require '../../templates/views/work-search-results.jade'
	queryOptions:
		term: '*'
		typeString: config.get 'workTypeString'
		resultRows: 25

	initialize: (@options) ->
		super
		@render()

module.exports = WorkSearch