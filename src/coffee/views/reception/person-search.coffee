ReceptionBaseSearch = require './base-search'

class ReceptionPersonSearch extends ReceptionBaseSearch	
	getTypeString: () ->
		'personTypeString'

	getFacetNameMap: () ->
		facetNameMap =
			dynamic_s_collective: 'Collective'
			dynamic_s_birthplace: 'Place of Birth'
			dynamic_s_deathplace: 'Place of Death'
			dynamic_s_residence: 'Country'
			dynamic_s_language: 'Language'
			dynamic_s_birthDate: 'Year of Birth'
			dynamic_s_deathDate: 'Year of Death'
			dynamic_s_gender: 'Gender'
			dynamic_s_religion: 'Religion'

module.exports = ReceptionPersonSearch