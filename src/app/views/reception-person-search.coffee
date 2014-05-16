ReceptionBaseSearch = require './reception-base-search'

class ReceptionPersonSearch extends ReceptionBaseSearch	
	getTypeString: () ->
		'personTypeString'
		
	getFacetNameMap: () ->
		facetNameMap:
			dynamic_s_collective: 'Collective'
			dynamic_s_birthplace: 'Place of Birth'
			dynamic_s_birthDate: 'Year of Birth'
			dynamic_s_deathDate: 'Year of Death'
			dynamic_s_gender: 'Gender'
module.exports = ReceptionPersonSearch