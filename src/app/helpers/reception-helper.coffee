ConfigHelper = require './config-helper'

class ReceptionHelper
	constructor: (configHelper = null) ->
		@configHelper = if configHelper? then configHelper else new ConfigHelper()
	getPersonReceptions: () ->
		@getReceptionsFor('person')
	
	getDocumentReceptions: () ->
		@getReceptionsFor('document')
		
	getReceptionsFor: (baseSourceType) ->
		receptions = @configHelper.get('receptions')
		filteredReceptions = reception for reception in receptions when reception.baseSourceType is baseSourceType
	
module.exports = ReceptionHelper