Backbone = require 'backbone'
BaseSearch = require '../base-search.coffee'

config = require '../../config.coffee'

class PersonSearch extends BaseSearch
	resultsTemplate: require '../../../templates/views/person/person-search-results.jade'
	queryOptions:
		term: '*'
		typeString: config.get 'personTypeString'
		resultRows: 25
	facets: [ # Determines which facets get shown and in what order
		'dynamic_s_gender'
		'dynamic_s_birthDate'
		'dynamic_s_residence'
		'dynamic_s_language'
		'dynamic_s_birthplace'
		'dynamic_s_deathDate'
		'dynamic_s_deathplace'
		'dynamic_s_collective'
		'dynamic_s_religion'
	]
	facetTitleMap:
		dynamic_s_gender: 'Gender'
		dynamic_s_birthDate: 'Year of Birth'
		dynamic_s_residence: 'Country'
		dynamic_s_language: 'Language'
		dynamic_s_birthplace: 'Place of Birth'
		dynamic_s_deathDate: 'Year of Death'
		dynamic_s_deathplace: 'Place of Death'
		dynamic_s_collective: 'Memberships'
		dynamic_s_religion: 'Religion'
	sortableFieldsMap:
		dynamic_k_deathDate: 'Year of Death'
		dynamic_k_birthDate: 'Year of Birth'
		dynamic_sort_name: 'Name'

	textSearchTitle: 'Name'


	initialize: (@options) ->
		super
		@render()

module.exports = PersonSearch