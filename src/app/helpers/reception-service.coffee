Backbone = require 'backbone'

config =  require '../config'

class ReceptionService
	constructor: (options = {}) ->
		@searchUrl = options.url ? (config.get('baseUrl') + config.get('relationSearchPath'))
	
	search: (parameters = {}, searchResults) ->
		searchOptions =
			url: @searchUrl
			headers:
				VRE_ID: 'WomenWriters'
			type: 'POST'
			data: JSON.stringify parameters
			contentType: 'application/json'

		fetchResults = (data, status, request) =>
			Backbone.$.getJSON request.getResponseHeader 'Location'

		Backbone.$.ajax(searchOptions).then(fetchResults)
	
module.exports = ReceptionService