Backbone = require 'backbone'

RelationTypeSelector = require './relation-type-selector'

class ReceptionSearcher extends Backbone.View
	template: require '../../templates/views/reception-searcher.jade'
	className: 'receptions-search'
	
	events:
		'click .reception-query.relation-type .edit-link' : 'editRelationTypes'
	
	initialize: (options) ->
		@relationTypeSelector = options.relationTypeSelector
		@render()
	
	render: ->
		@$el.html( @template(receptionSearch: "Hello world"))
		@relationTypeSelector.render()
		@$el.find('.reception-search').after(@relationTypeSelector.$el)

	editRelationTypes: (e) ->
		@relationTypeSelector.show()

module.exports = ReceptionSearcher