Backbone = require 'backbone'
BaseSearch = require './base-search.coffee'

config = require '../config.coffee'

class PersonSearch extends BaseSearch
	resultsTemplate: require '../../templates/views/person-search-results.jade'
	queryOptions:
		term: '*'
		typeString: config.get 'personTypeString'
		resultRows: 25
	facetNameMap:
		dynamic_s_collective: 'Collective'
		dynamic_s_birthPlace: 'Place of Birth'
		dynamic_s_birthDate: 'Year of Birth'
		dynamic_s_deathDate: 'Year of Death'
		dynamic_s_gender: 'Gender'
	sortableFieldsMap:
		dynamic_sort_deathDate: 'Year of Death'
		dynamic_sort_birthDate: 'Year of Birth'
		dynamic_sort_name: 'Name'


	initialize: (@options) ->
		super
		@render()

module.exports = PersonSearch