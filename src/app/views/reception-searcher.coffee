Backbone = require 'backbone'

class ReceptionSearcher extends Backbone.View
	template: require '../../templates/views/reception-searcher.jade'
	className: 'receptions-search'
	
	initialize: ->
		@render()
	
	render: ->
		@$el.html( @template(receptionSearch: "Hello world"))


module.exports = ReceptionSearcher