# converts a reception type to an html option element
class RelationTypeOptionConverter
	
	convert: (relationType) ->
		option = "<option value=\"#{relationType.typeId}\">#{relationType.inverseName}</option>"
		return option
		
module.exports = RelationTypeOptionConverter