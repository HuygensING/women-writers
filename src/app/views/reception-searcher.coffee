Backbone = require 'backbone'

RelationTypeSelector = require './relation-type-selector'

class ReceptionSearcher extends Backbone.View
	template: require '../../templates/views/reception-searcher.jade'
	className: 'receptions-search'
	
	events:
		'click .reception-query.relation-type .edit-link' : 'editRelationTypes'
		'click .unimplemented' : 'showUnimpelmentedMessage'
	
	initialize: (options) ->
		@relationTypeSelector = options.relationTypeSelector
		@render()
	
	render: ->
		@$el.html(@template())
		@relationTypeSelector.render()
		@$el.find('.reception-search').after(@relationTypeSelector.$el)

	editRelationTypes: (e) ->
		@relationTypeSelector.show()
	
	showUnimpelmentedMessage: ->
		console.log 'alert'
		alert('This part will be implemented soon.')

module.exports = ReceptionSearcher