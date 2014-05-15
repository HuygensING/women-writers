Backbone = require 'backbone'

ReceptionDocumentSearch = require './reception-document-search'
ReceptionPersonSearch = require './reception-person-search'

class ReceptionSearcher extends Backbone.View
	template: require '../../templates/views/reception-searcher.jade'
	className: 'receptions-search'
	
	events:
		'click .reception-query.relation-type .edit-link' : 'editRelationTypes'
		'click .reception-query.target .edit-link' : 'editReceptions'
		'click .unimplemented': 'showUnimplementedMessage'
		'sourceTypeSelectedEvent': 'addSourceType'
		
	
	initialize: (options) ->
		@relationTypeSelector = options.relationTypeSelector
		@receptionEditor = options.receptionEditor
		@receptionSearchCreator = options.receptionSearchCreator 
	
	render: ->
		@$el.html(@template())
		receptionSearchElement = @findQueryEditorElement()
		
		@relationTypeSelector.render(receptionSearchElement)
		@receptionEditor.render(receptionSearchElement)

	editRelationTypes: (e) ->
		@relationTypeSelector.show()
		
	editReceptions: (e) ->
		@receptionEditor.show()
	
	addSourceType: (e, value) ->
		@receptionSearchCreator.create(value).render(@findQueryEditorElement())
		
	findQueryEditorElement: () ->
		@$el.find('.query-editor')
	
	showUnimplementedMessage: ->
		alert('This part will be implemented soon.')

module.exports = ReceptionSearcher