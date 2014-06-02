Backbone = require 'backbone'

ReceptionDocumentSearch = require './document-search'
ReceptionPersonSearch = require './person-search'

class ReceptionSearcher extends Backbone.View
	template: require '../../../templates/views/reception/reception-searcher.jade'
	className: 'reception-search'
	
	events:
		'click .reception-query.relation-type .edit-link': 'editRelationTypes'
		'click .reception-query.target .edit-link': 'editReceptions'
		'click .reception-query.source .edit-link': 'editSource'
		'click .search-receptions': 'search'
		'click a.unimplemented': 'showUnimplementedMessage'
		'click button.unimplemented': 'showUnimplementedMessage'
		'sourceTypeSelectedEvent': 'addSourceQueryBuilder'
		
	
	initialize: (options) ->
		@relationTypeSelector = options.relationTypeSelector
		@receptionQueryBuilder = options.receptionQueryBuilder
		@receptionSearchCreator = options.receptionSearchCreator
		@receptionSearchResult = options.receptionSearchResult
		@receptionSearchQueryExecutor = options.receptionSearchQueryExecutor
	
	render: ->
		@$el.html(@template())
		receptionSearchElement = @findQueryEditorElement()
		
		@relationTypeSelector.render(receptionSearchElement)
		@receptionQueryBuilder.render(receptionSearchElement)
		
		@receptionSearchResult.render(@$el.find('.results'))

	editRelationTypes: (e) ->
		@relationTypeSelector.show()
		@receptionQueryBuilder.hide()
		if @sourceQueryBuilder? then	@sourceQueryBuilder.hide()
		
	editReceptions: (e) ->
		@receptionQueryBuilder.show()
		if @sourceQueryBuilder? then	@sourceQueryBuilder.hide()
		@relationTypeSelector.hide()
				
	editSource: (e) ->
		@sourceQueryBuilder.show()
		@relationTypeSelector.hide()
		@receptionQueryBuilder.hide()
	
	addSourceQueryBuilder: (e, value) ->
		if(@sourceQueryBuilder isnt null and @sourceQueryBuilder isnt undefined)
			@sourceQueryBuilder.remove()
		
		@sourceQueryBuilder = @receptionSearchCreator.create(value)
		@sourceQueryBuilder.render(@findQueryEditorElement())
		# enable the source editor link
		@$('.reception-query.source .edit-link').removeClass('disabled')
		
		# enable search button
		@$('.search-receptions').removeClass('disabled')
		
	search: (e) ->
		queryParameters = {
			sourceSearchId: @sourceQueryBuilder.getSearchId()
			targetSearchId: @receptionQueryBuilder.getSearchId()
			relationTypeIds: @relationTypeSelector.getSelectedRelationTypeIds()
			typeString: 'wwrelation'
		}
		
		result = @receptionSearchQueryExecutor.executeQuery(queryParameters, @receptionSearchResult)
		
	findQueryEditorElement: () ->
		@$el.find('.query-editor')
	
	showUnimplementedMessage: ->
		alert('This part will be implemented soon.')

module.exports = ReceptionSearcher