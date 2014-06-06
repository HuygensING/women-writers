Backbone = require 'backbone'
_ = require 'underscore'

ReceptionDocumentSearch = require './document-search'
ReceptionPersonSearch = require './person-search'
BusyOverlay = require '../busy-overlay'

RelationTypeSelector = require '../relation-type-selector'
ReceptionQueryBuilder = require './reception-query-builder'
SourceQueryBuilder = require './source-query-builder'
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
		'queryBuilderCloseEvent': 'deselectReceptionQuery'
		
	initialize: (options) ->
		@eventBus = options.eventBus ? @createEventBus()
		@relationTypeSelector = options.relationTypeSelector ? new RelationTypeSelector
			eventBus: @eventBus
		@receptionQueryBuilder = options.receptionQueryBuilder ? new ReceptionQueryBuilder()
		@sourceQueryBuilder = options.sourceQueryBuilder ? new SourceQueryBuilder
			eventBus: @eventBus
		@receptionSearchCreator = options.receptionSearchCreator ? new ReceptionSearchCreator()
		@receptionSearchResult = options.receptionSearchResult ? new ReceptionSearchResult()
		@receptionSearchQueryExecutor = options.receptionSearchQueryExecutor ? new RelationSearchQueryExecutor
			eventBus: @eventBus 
		@busyOverlay = if(options.busyOverlay?) then options.busyOverlay else new BusyOverlay()
		
		@eventBus.on('searchDoneEvent', () =>
			@hideBusyOverlay()
		)
		
		@eventBus.on('sourceTypeSelectedEvent', () =>
			@handleSourceTypeSelected()
		)
		
	render: ->
		@$el.html(@template())
		receptionSearchElement = @findQueryEditorElement()
		
		@relationTypeSelector.render(receptionSearchElement)
		@receptionQueryBuilder.render(receptionSearchElement)
		@sourceQueryBuilder.render(receptionSearchElement)
		
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
	
		
	handleSourceTypeSelected: () ->
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
		
	createEventBus: () ->
		eventBus = {}
		_.extend(eventBus, Backbone.Events)

module.exports = ReceptionSearcher