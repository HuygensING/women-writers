Backbone = require 'backbone'
_ = require 'underscore'

ReceptionDocumentSearch = require './document-search'
ReceptionPersonSearch = require './person-search'

RelationTypeSelector = require '../relation-type-selector'
ReceptionQueryBuilder = require './reception-query-builder'
SourceQueryBuilder = require './source-query-builder'
ReceptionSearchResult = require './search-result'
RelationSearchQueryExecutor = require '../../helpers/relation-search-query-executor'

class ReceptionSearcher extends Backbone.View
	template: require '../../../templates/views/reception/reception-searcher.jade'
	className: 'reception-search'
	
	events:
		'click .tab.relation-type': 'editRelationTypes'
		'click .tab.target': 'editReceptions'
		'click .tab.source': 'editSource'
		'click .tab.search .search-receptions': 'search'
		
	initialize: (options) ->
		@eventBus = options.eventBus ? @createEventBus()
		@relationTypeSelector = options.relationTypeSelector ? new RelationTypeSelector
			eventBus: @eventBus
		@receptionQueryBuilder = options.receptionQueryBuilder ? new ReceptionQueryBuilder()
		@sourceQueryBuilder = options.sourceQueryBuilder ? new SourceQueryBuilder
			eventBus: @eventBus
		@receptionSearchResult = options.receptionSearchResult ? new ReceptionSearchResult()
		@receptionSearchQueryExecutor = options.receptionSearchQueryExecutor ? new RelationSearchQueryExecutor
			eventBus: @eventBus 
		
		@eventBus.on 'searchDoneEvent', =>
			@$el.removeClass 'searching'
			@$('.query-editor').slideUp()
		
		@eventBus.on('sourceTypeSelectedEvent', () =>
			@handleSourceTypeSelected()
		)
		
	render: ->
		@$el.html(@template())
		receptionSearchElement = @findQueryEditorElement()
		
		@relationTypeSelector.render(receptionSearchElement)
		@receptionQueryBuilder.render(receptionSearchElement)
		@sourceQueryBuilder.render(receptionSearchElement)
		
		@receptionSearchResult.render @$el.find('.results')
		
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
		
	enableSourceEditorLink: () ->
		@$('.reception-query.relation-type').removeClass('disabled')
		
	enableSearchButton: () ->
		@$('.search-receptions').removeClass('disabled')

	selectTab: (e) ->
		@$('.selected').removeClass 'selected'
		@$(e.currentTarget).addClass 'selected'

	search: (e) ->
		@$el.addClass 'searching'

		queryParameters = {
			sourceSearchId: @sourceQueryBuilder.getSearchId()
			targetSearchId: @receptionQueryBuilder.getSearchId()
			relationTypeIds: @relationTypeSelector.getSelectedRelationTypeIds()
			typeString: 'wwrelation'
		}

		result = @receptionSearchQueryExecutor.executeQuery(queryParameters, @receptionSearchResult)

	findQueryEditorElement: () ->
		@$el.find('.query-editor')

	createEventBus: () ->
		eventBus = {}
		_.extend(eventBus, Backbone.Events)

module.exports = ReceptionSearcher