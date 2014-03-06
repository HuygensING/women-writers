Backbone = require 'backbone'

class Config extends Backbone.Model
	# this 'file' is aliased in Gruntfile to a specific
	# configuration, such as development, test, or production
	defaults: require './config/config.yaml'

	allPersonsUrl: ->
		@get('facetedSearchBaseUrl') + @get('personsRootUrl')

	personUrl: (id) ->
		@allPersonsUrl() + '/' + id

	allWorksUrl: ->
		console.log "Fetching ", @get 'worksRootUrl'
		@get('facetedSearchBaseUrl') + @get('worksRootUrl')

	workUrl: (id) ->
		@allWorksUrl() + '/' + id

module.exports = new Config