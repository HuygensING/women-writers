ReceptionDocumentSearch = require '../../../src/app/views/reception/document-search'
ReceptionPersonSearch = require '../../../src/app/views/reception/person-search'

SearchCreatorWrapper = require '../helpers/search-creator-wrapper'

class ReceptionSearchCreator
	constructor: (options = {})->
		@searchCreatorWrapper = options.searchCreatorWrapper ? new SearchCreatorWrapper()
	
	create: (type) ->
		receptionSearch = null
		
		if type is 'documents'
			receptionSearch = new ReceptionDocumentSearch
				searchCreatorWrapper: @searchCreatorWrapper
		else if type is 'persons'
			receptionSearch = new ReceptionPersonSearch
				searchCreatorWrapper: @searchCreatorWrapper
		
		return receptionSearch
		
module.exports = ReceptionSearchCreator