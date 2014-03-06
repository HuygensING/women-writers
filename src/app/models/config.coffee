Backbone = require 'backbone'

class Config extends Backbone.Model
	# this 'file' is aliased in Gruntfile to a specific
	# configuration, such as development, test, or production
	defaults: require 'config/config.yaml'

	allPersonsURL: ->
		@get('facetedSearchBaseUrl') + '/domain/wwpersons'

	personURL: (id) ->
		@get('facetedSearchBaseUrl') + "/domain/wwpersons/#{id}"

	allWorksURL: ->
		@get('facetedSearchBaseUrl') + '/domain/wwdocuments'

	workURL: (id) ->
		@get('facetedSearchBaseUrl') + "domain/wwdocuments/#{id}"

module.exports = new Config