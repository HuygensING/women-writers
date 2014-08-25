Backbone = require 'backbone'

class Config extends Backbone.Model
	# this file is aliased in Gruntfile to a specific
	# configuration, such as development, test, or production
	defaults: require '../../config/targets/development.json'

	initialize: ->
		try
			hasLocalStorage = window.localStorage?
		catch
			hasLocalStorage = false

		if hasLocalStorage and not @get('authToken')?
			@set authToken: window.localStorage.getItem('authToken')
			@on 'change:authToken', =>
				window.localStorage.setItem('authToken', @get 'authToken')

	searchUrl: (type) -> @get('baseUrl') + @searchPath(type)
	searchPath: (type) ->
		if type
			@get('searchPath') + '/' + type
		else
			@get('searchPath')

	relationsUrl: -> @get('baseUrl') + '/api/domain/wwrelations'

	allPersonsUrl: -> @get('facetedSearchBaseUrl') + @get('personsRootUrl')
	personUrl: (id) -> @allPersonsUrl() + '/' + id
	personViewPath: (id) -> '/persons/' + id
	personViewUrl: (id) -> @get('baseUrl') + @personViewPath id 
	personEditUrl: (id) -> @personViewUrl(id) + '/edit'

	allDocumentsUrl: -> @get('facetedSearchBaseUrl') + @get('documentsRootUrl')
	documentUrl: (id) -> @allDocumentsUrl() + '/' + id
	documentViewPath: (id) -> '/documents/' + id
	documentViewUrl: (id) -> @get('baseUrl') + @documentViewPath id
	documentEditUrl: (id) -> @documentViewUrl(id) + '/edit'

	sourceViewUrl: (id) -> @get('baseUrl') + '/sources/' + id

	# Returns view url inferred from ID (PERS/DOC)
	viewUrl: (id) ->
		if id.match /^DOC/
			@documentViewUrl id
		else if id.match /^PERS/
			@personViewUrl id

	editUrl: (id) ->
		if id.match /^DOC/
			@documentEditUrl id
		else if id.match /^PERS/
			@personEditUrl id

	educationUrl: ->
		@get('facetedSearchBaseUrl') + @get('educationPath')

	financialSituationUrl: ->
		@get('facetedSearchBaseUrl') + @get('financialSituationPath')

	maritalStatusUrl: ->
		@get('facetedSearchBaseUrl') + @get('maritalStatusPath')
	
	professionUrl: ->
		@get('facetedSearchBaseUrl') + @get('professionPath')
		
	religionUrl: ->
		@get('facetedSearchBaseUrl') + @get('religionPath')
		
	socialClassUrl: ->
		@get('facetedSearchBaseUrl') + @get('socialClassPath')

	sourceCategoryUrl: ->
		@get('facetedSearchBaseUrl') + @get('sourceCategoryPath')

	userInfoUrl: ->
		@get('baseUrl') + @get('userInfoPath')

	receptionsUrl: ->
		@get('baseUrl') + '/api/system/vres/' + @get('VRE_ID')

	receptionsFor: (type) ->
		receptions = @get('receptions')
		r for r in receptions when r.baseSourceType is type

	personReceptions: -> @receptionsFor 'person'
	documentReceptions: -> @receptionsFor 'document'

	router: -> @get 'router'

module.exports = new Config