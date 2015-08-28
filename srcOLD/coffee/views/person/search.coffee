Backbone = require 'backbone'
BaseSearch = require '../base-search.coffee'

config = require '../../config'

class PersonSearch extends BaseSearch
	resultsTemplate: require '../../../jade/views/person/person-search-results.jade'
	type: 'wwpersons'
	queryOptions:
		term: '*'
		typeString: config.get 'personTypeString'
		sortParameters: [
			{
				fieldname: 'dynamic_sort_name'
				direction: 'asc'
			}
		]
		sortParameters: [
			fieldname: 'dynamic_sort_name'
			direction: 'asc'
		]
	facetTitleMap: config.get 'personFacetTitles'
	sortableFieldsMap:
		dynamic_k_deathDate: 'Year of Death'
		dynamic_k_birthDate: 'Year of Birth'
		dynamic_sort_name: 'Name'
	textSearchTitleMap: config.get 'textSearchTitles'
	fsTemplates:
		facets: require '../../../jade/faceted-search/person.jade'
		# textSearch: require '../../../jade/faceted-search/person-text-search.jade'

	initialize: (@options) ->
		super
		@render()

module.exports = PersonSearch