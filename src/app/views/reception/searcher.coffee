Backbone = require 'backbone'

ReceptionDocumentSearch = require './document-search'
ReceptionPersonSearch = require './person-search'
BusyOverlay = require '../busy-overlay'
SourceSearchTemplate = require '../../../templates/views/reception/source-search.jade'

RelationTypeSelector = require '../relation-type-selector'
ReceptionDocumentSearch = require './document-search'
ReceptionSearchResult = require './search-result'
ReceptionSearchCreator = require '../../helpers/reception-search-creator'
RelationSearchQueryExecutor = require '../../helpers/relation-search-query-executor'

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
		'sourceTypeSelectedEvent': 'handleSourceTypeSelected'
		'queryBuilderCloseEvent': 'deselectReceptionQuery'
		
		
	
	initialize: (options) ->
		@relationTypeSelector = options.relationTypeSelector ? new RelationTypeSelector()
		@receptionQueryBuilder = options.receptionQueryBuilder ? new ReceptionDocumentSearch()
		@receptionSearchCreator = options.receptionSearchCreator ? new ReceptionSearchCreator()
		@receptionSearchResult = options.receptionSearchResult ? new ReceptionSearchResult()
		@receptionSearchQueryExecutor = options.receptionSearchQueryExecutor ? new RelationSearchQueryExecutor() 
		@busyOverlay = if(options.busyOverlay?) then options.busyOverlay else new BusyOverlay()
		
		eventBus = @receptionSearchQueryExecutor.eventBus
		
		eventBus.on('searchDoneEvent', () =>
			@hideBusyOverlay()
		)
		
	
	render: ->
		@$el.html(@template())
		receptionSearchElement = @findQueryEditorElement()
		
		@relationTypeSelector.render(receptionSearchElement)
		@receptionQueryBuilder.render(receptionSearchElement)
		
		@receptionSearchResult.render(@$el.find('.results'))
		
		@busyOverlay.render(@$el)

	editRelationTypes: (e) ->
		@selectTab(e)
		@relationTypeSelector.show()
		@receptionQueryBuilder.hide()
		if @sourceQueryBuilder? then	@sourceQueryBuilder.hide()
		
	editReceptions: (e) ->
		@selectTab(e)
		@receptionQueryBuilder.show()
		if @sourceQueryBuilder? then	@sourceQueryBuilder.hide()
		@relationTypeSelector.hide()
				
	editSource: (e) ->
		@selectTab(e)
		@sourceQueryBuilder.show()
		@relationTypeSelector.hide()
		@receptionQueryBuilder.hide()
	
		
	handleSourceTypeSelected: (e, value) ->
		@addSourceQueryBuilder(value)
		@enableSourceEditorLink()
		@enableSearchButton()
	
	addSourceQueryBuilder: (value) ->
		if(@sourceQueryBuilder isnt null and @sourceQueryBuilder isnt undefined)
			@sourceQueryBuilder.remove()
		
		@sourceQueryBuilder = @receptionSearchCreator.create(value)
		@sourceQueryBuilder.render(@findQueryEditorElement())
		
	enableSourceEditorLink: () ->
		@$('.reception-query.relation-type .edit-link').removeClass('disabled')
		
	enableSearchButton: () ->
		@$('.search-receptions').removeClass('disabled')
		
	selectTab: (e) ->
		@deselectReceptionQuery()
		@$(e.currentTarget).parent().addClass('selected')
		
	search: (e) ->
		@displayBusyOverlay()
		
		queryParameters = {
			sourceSearchId: @sourceQueryBuilder.getSearchId()
			targetSearchId: @receptionQueryBuilder.getSearchId()
			relationTypeIds: @relationTypeSelector.getSelectedRelationTypeIds()
			typeString: 'wwrelation'
		}
		
		result = @receptionSearchQueryExecutor.executeQuery(queryParameters, @receptionSearchResult)
		
	displayBusyOverlay: () ->
		@busyOverlay.show()
	
	hideBusyOverlay: () ->
		@busyOverlay.hide()
		
	findQueryEditorElement: () ->
		@$el.find('.query-editor')
		
	deselectReceptionQuery: () ->
		@$('.reception-query').removeClass('selected')
	
	showUnimplementedMessage: ->
		alert('This part will be implemented soon.')
		

module.exports = ReceptionSearcher