Backbone = require 'backbone'

class ReceptionSearcher extends Backbone.View
	template: require '../../templates/views/reception-searcher.jade'
	className: 'receptions-search'
	
	events:
		'click .reception-query.relation-type .edit-link' : 'editRelationTypes'
	
	initialize: (relationTypeSelector = null) ->
		@relationTypeSelector = relationTypeSelector
		
		@render()
	
	render: ->
		@$el.html( @template(receptionSearch: "Hello world"))

	editRelationTypes: (e) ->
		@relationTypeSelector.show()

module.exports = ReceptionSearcher