Backbone = require  'backbone'
$ = require 'jquery'

config = require '../../config'

class ReceptionSearchResult extends Backbone.View
	template: require '../../../templates/views/reception/search-result.jade'
	
	events:
		'click .next': 'updateResults'
		'click .prev': 'updateResults'
	
	update: (result = {}) ->
		relIds = {}
		relIds[relation._id] = relation for relation in result.results

		@$el.html @template
			response: result
			relIds: relIds
			config: config
		@parentElement.append(@$el)
		
	render: (parentElement) ->
		@parentElement = parentElement
		@parentElement.append(@$el)
	
	updateResults: (e) ->
		url = $(e.currentTarget).attr('href')
		
		instance = @
		
		$.ajax({
			type: 'GET'
			url: url
			success: (data) ->
				instance.update(data)
		})
module.exports = ReceptionSearchResult