Backbone = require 'backbone'

class Config extends Backbone.Model
	# this 'file' is aliased in Gruntfile to a specific
	# configuration, such as development, test, or production
	defaults: require './config/config.yaml'

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


module.exports = new Config