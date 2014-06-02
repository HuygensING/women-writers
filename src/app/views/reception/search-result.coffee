Backbone = require  'backbone'
$ = require 'jquery'

class ReceptionSearchResult extends Backbone.View
	template: require '../../../templates/views/reception/reception-search-result.jade'
	
	events:
		'click .next': 'updateResults'
		'click .prev': 'updateResults'
	
	update: (result = {}) ->
		@$el.html(@template(response: result))
		@parentElement.append(@$el)
		
	render: (parentElement) ->
		@$el.html('<div>')
		@parentElement = parentElement
		@parentElement.append(@$el)
	
	updateResults: (e) ->
		url = $(e.currentTarget).attr('href')
		
		console.log('url', url)
		
		instance = @
		
		$.ajax({
			type: 'GET'
			url: url
			success: (data) ->
				instance.update(data)
		})
module.exports = ReceptionSearchResult