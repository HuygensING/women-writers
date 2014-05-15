Backbone = require 'backbone'

ReceptionDocumentSearch = require './reception-document-search'
ReceptionPersonSearch = require './reception-person-search'

class ReceptionSearcher extends Backbone.View
	template: require '../../../templates/views/reception/reception-searcher.jade'
	className: 'receptions-search'
	
	events:
		'click .reception-query.relation-type .edit-link': 'editRelationTypes'
		'click .reception-query.target .edit-link': 'editReceptions'
		'click .reception-query.source .edit-link': 'editSource'
		'click a.unimplemented': 'showUnimplementedMessage'
		'sourceTypeSelectedEvent': 'addSourceEditor'
		
	
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
		
	editSource: (e) ->
		@sourceEditor.show()
	
	addSourceEditor: (e, value) ->
		@sourceEditor = @receptionSearchCreator.create(value)
		@sourceEditor.render(@findQueryEditorElement())
		# enable the source editor link
		@$('.reception-query.source .edit-link').removeClass('disabled')
		
	findQueryEditorElement: () ->
		@$el.find('.query-editor')
	
	showUnimplementedMessage: ->
		alert('This part will be implemented soon.')

module.exports = ReceptionSearcher