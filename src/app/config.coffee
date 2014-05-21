Backbone = require 'backbone'

receptionTypes = require '../../config/receptions.yaml'

class Config extends Backbone.Model
	# this 'file' is aliased in Gruntfile to a specific
	# configuration, such as development, test, or production
	defaults: require './config/config.yaml'

	initialize: ->
		hasLocalStorage = window.localStorage?

		if hasLocalStorage and not @get('authToken')?
			@set authToken: window.localStorage.getItem('authToken')
			@on 'change:authToken', =>
				window.localStorage.setItem('authToken', @get 'authToken')

		@set receptionTypes: receptionTypes

	searchUrl: ->
		@get('baseUrl') + @get('searchPath')

	relationsUrl: ->
		@get('baseUrl') + '/api/domain/wwrelations'

	allPersonsUrl: ->
		@get('facetedSearchBaseUrl') + @get('personsRootUrl')

	personUrl: (id) ->
		@allPersonsUrl() + '/' + id

	personViewUrl: (id) ->
		@get('baseUrl') + '/person/' + id

	personEditUrl: (id) ->
		@personViewUrl(id) + '/edit'

	allDocumentsUrl: ->
		@get('facetedSearchBaseUrl') + @get('documentsRootUrl')

	documentUrl: (id) ->
		@allDocumentsUrl() + '/' + id

	documentViewUrl: (id) ->
		@get('baseUrl') + '/document/' + id

	documentEditUrl: (id) ->
		@documentViewUrl(id) + '/edit'

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

module.exports = new Config