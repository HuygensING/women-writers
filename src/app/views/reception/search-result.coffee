Backbone = require  'backbone'

class ReceptionSearchResult extends Backbone.View
	template: require '../../../templates/views/reception/reception-search-result.jade'
	
	update: (result = {}) ->
		@$el.html(@template(results: result.results))
		console.log('html', @$el.html())
	
	render: (parentElement) ->
		parentElement.append(@$el)
	
module.exports = ReceptionSearchResult