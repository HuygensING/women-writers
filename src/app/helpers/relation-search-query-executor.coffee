Backbone = require 'backbone'

ConfigHelper =  require './config-helper'

class RelationSearchQueryExecutor
	
	constructor: (requestExecutor, configHelper, eventBus) ->
		@requestExecutor = requestExecutor
		@configHelper = if configHelper? then configHelper else new ConfigHelper()
		@eventBus = @getEventBus(eventBus)
	
	executeQuery: (parameters = {}, searchResults) ->
		requestExecutor = @requestExecutor
		eventBus = @eventBus
		
		# todo => gebruiken
		callback = (data, status, request) ->
			requestExecutor.ajax({
				type: 'GET'
				url: request.getResponseHeader('Location')
				success: (data) ->
					eventBus.trigger('searchDoneEvent')
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
		
	getEventBus: (eventBus) ->
		triggerer = null
		if(eventBus? )
			triggerer = eventBus
		else
			triggerer = {}
			_.extend(triggerer, Backbone.Events)
			
		return triggerer
		
	
module.exports = RelationSearchQueryExecutor