CollectionHelper = require './collection-helper'

class ReceptionHelper
	constructor: (collectionHelper = null) ->
		@collectionHelper = if collectionHelper? then collectionHelper else new CollectionHelper()
	getPersonReceptions: () ->
		@getReceptionsFor('person')
	
	getDocumentReceptions: () ->
		@getReceptionsFor('document')
		
	getReceptionsFor: (baseSourceType) ->
		receptions = @collectionHelper.get('receptions')
		filteredReceptions = reception for reception in receptions when reception.baseSourceType is baseSourceType
	
module.exports = ReceptionHelper