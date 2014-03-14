Backbone = require 'backbone'

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

	allPersonsUrl: ->
		@get('facetedSearchBaseUrl') + @get('personsRootUrl')

	personUrl: (id) ->
		@allPersonsUrl() + '/' + id

	personViewUrl: (id) ->
		@get('baseUrl') + '/person/' + id

	allWorksUrl: ->
		@get('facetedSearchBaseUrl') + @get('worksRootUrl')

	workUrl: (id) ->
		@allWorksUrl() + '/' + id

	workViewUrl: (id) ->
		@get('baseUrl') + '/work/' + id

	userInfoUrl: ->
		@get('baseUrl') + @get('userInfoPath')


module.exports = new Config