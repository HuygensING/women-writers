Backbone = require 'backbone'

class ReceptionSearcher extends Backbone.View
	template: require '../../../templates/views/reception/reception-searcher.jade'
	className: 'receptions-search'
	
	events:
		'click .reception-query.relation-type .edit-link' : 'editRelationTypes'
		'click .reception-query.target .edit-link' : 'editReceptions'
		'click .unimplemented' : 'showUnimpelmentedMessage'
	
	initialize: (options) ->
		@relationTypeSelector = options.relationTypeSelector
		@receptionEditor = options.receptionEditor
	
	render: ->
		@$el.html(@template())
		@relationTypeSelector.render()
		@receptionEditor.render()
		@$el.find('.reception-search').after(@receptionEditor.$el)
		@$el.find('.reception-search').after(@relationTypeSelector.$el)

	editRelationTypes: (e) ->
		@relationTypeSelector.show()
		
	editReceptions: (e) ->
		@receptionEditor.show()
	
	showUnimpelmentedMessage: ->
		alert('This part will be implemented soon.')

module.exports = ReceptionSearcher