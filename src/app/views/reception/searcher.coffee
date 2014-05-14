Backbone = require 'backbone'

class ReceptionSearcher extends Backbone.View
	template: require '../../../templates/views/reception/reception-searcher.jade'
	className: 'receptions-search'
	
	events:
		'click .reception-query.relation-type .edit-link' : 'editRelationTypes'
		'click .reception-query.target .edit-link' : 'editReceptions'
		'click .unimplemented' : 'showUnimplementedMessage'
	
	initialize: (options) ->
		@relationTypeSelector = options.relationTypeSelector
		@receptionEditor = options.receptionEditor
	
	render: ->
		@$el.html(@template())
		receptionSearchElement = @$el.find('.query-editor')
		
		@relationTypeSelector.render(receptionSearchElement)
		@receptionEditor.render(receptionSearchElement)

	editRelationTypes: (e) ->
		@relationTypeSelector.show()
		
	editReceptions: (e) ->
		@receptionEditor.show()
	
	showUnimplementedMessage: ->
		alert('This part will be implemented soon.')

module.exports = ReceptionSearcher