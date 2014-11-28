ReceptionDocumentSearch = require '../../../src/app/views/reception/document-search'
ReceptionPersonSearch = require '../../../src/app/views/reception/person-search'

SearchCreatorWrapper = require '../helpers/search-creator-wrapper'

class ReceptionSearchCreator
	constructor: (options = {})->
		@searchCreatorWrapper = options.searchCreatorWrapper ? new SearchCreatorWrapper()
	
	create: (type) ->
		new ReceptionPersonSearch
			searchCreatorWrapper: @searchCreatorWrapper
		
module.exports = ReceptionSearchCreator