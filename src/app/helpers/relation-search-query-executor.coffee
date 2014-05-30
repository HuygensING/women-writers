ConfigHelper =  require './config-helper'

class RelationSearchQueryExecutor
	
	constructor: (requestExecutor, configHelper) ->
		@requestExecutor = requestExecutor
		@configHelper = if configHelper? then configHelper else new ConfigHelper()
	
	executeQuery: (parameters = {}, searchResults) ->
		requestExecutor = @requestExecutor
		
		callback = (data, status, request) ->
			requestExecutor.ajax({
				type: 'GET'
				url: request.getResponseHeader('Location')
				success: (data) ->
					searchResults.update(data)
			})
		
		@requestExecutor.ajax({
			url: @getUrl()
			headers: {VRE_ID: 'WomenWriters'}
			type: 'POST'
			data: JSON.stringify(parameters)
			contentType: 'application/json'
			success: callback
		})
	
	getUrl: () ->
		return (@configHelper.get('baseUrl') + @configHelper.get('relationSearchPath'))
	
module.exports = RelationSearchQueryExecutor