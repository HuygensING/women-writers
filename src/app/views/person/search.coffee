Backbone = require 'backbone'
BaseSearch = require '../base-search.coffee'

config = require '../../config.coffee'

class PersonSearch extends BaseSearch
	resultsTemplate: require '../../../templates/views/person/person-search-results.jade'
	queryOptions:
		term: '*'
		typeString: config.get 'personTypeString'
		resultRows: 25
	facetNameMap:
		dynamic_s_collective: 'Memberships'
		dynamic_s_birthplace: 'Place of Birth'
		dynamic_s_birthDate: 'Year of Birth'
		dynamic_s_deathDate: 'Year of Death'
		dynamic_s_religion: 'Religion'
		dynamic_s_gender: 'Gender'
		dynamic_s_language: 'Language'
	sortableFieldsMap:
		dynamic_k_deathDate: 'Year of Death'
		dynamic_k_birthDate: 'Year of Birth'
		dynamic_sort_name: 'Name'


	initialize: (@options) ->
		super
		@render()

module.exports = PersonSearch