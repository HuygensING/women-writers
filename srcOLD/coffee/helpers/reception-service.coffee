Backbone = require 'backbone'

config =  require '../config'

class ReceptionService
	constructor: (options = {}) ->
		@searchUrl = options.url ? (config.get('baseUrl') + config.get('relationSearchPath'))
		@lastSearch = null

	search: (parameters = {}, numRows=100) ->
		searchOptions =
			url: @searchUrl
			headers:
				VRE_ID: config.get 'VRE_ID'
			type: 'POST'
			data: JSON.stringify parameters
			contentType: 'application/json'

		fetchResults = (data, status, request) =>
			@lastSearchUrl = request.getResponseHeader 'Location'
			Backbone.$.getJSON @lastSearchUrl + '?rows=' + numRows

		Backbone.$.ajax(searchOptions).then(fetchResults)

	setResultRows: (numRows) -> # re-fetch last result, but with other row-count
		Backbone.$.getJSON @lastSearchUrl + '?rows=' + numRows
	
module.exports = ReceptionService