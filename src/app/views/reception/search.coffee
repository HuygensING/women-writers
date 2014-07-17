Backbone = require 'backbone'
_ = require 'underscore'

ReceptionDocumentSearch = require './document-search'
ReceptionPersonSearch = require './person-search'

RelationTypeSelector = require '../relation-type-selector'
ReceptionQueryBuilder = require './reception-query-builder'
SourceQueryBuilder = require './source-query-builder'
ReceptionSearchResult = require './search-result'
RelationSearchQueryExecutor = require '../../helpers/relation-search-query-executor'

class ReceptionSearch extends Backbone.View
	template: require '../../../templates/views/reception/search.jade'
	className: 'reception-search'
	
	events:
		'click .select-type .link': 'selectReceptionOn'
		'click .tab.relation-type': 'editRelationTypes'
		'click .tab.receptions': 'editReceptions'
		'click .tab.source': 'editSource'
		'click .tab.search .search-receptions': 'search'

	initialize: (options) ->
		@eventBus = @createEventBus()

		@model = new Backbone.Model

		@receptionQueryBuilder = new ReceptionQueryBuilder
		@sourceQueryBuilder = new SourceQueryBuilder eventBus: @eventBus
		@receptionSearchResult = new ReceptionSearchResult
		@receptionSearchQueryExecutor = new RelationSearchQueryExecutor eventBus: @eventBus 
		
		@eventBus.on 'searchDoneEvent', =>
			@$el.removeClass 'searching'
			@$('.query-editor').slideUp()
		
		@eventBus.on('sourceTypeSelectedEvent', () =>
			@handleSourceTypeSelected()
		)
		
		@render()

	selectReceptionOn: (e) ->
		searchType = e.currentTarget.getAttribute 'data-type'
		@$('.source .link').text searchType
		@$('.query').addClass 'reception-on-selected'


	# editRelationTypes: (e) ->
	# 	@selectTab(e)
	# 	@relationTypeSelector.show()
	# 	@receptionQueryBuilder.hide()
	# 	if @sourceQueryBuilder? then	@sourceQueryBuilder.hide()
		
	editReceptions: (e) ->
		@receptionQueryBuilder.show()
		if @sourceQueryBuilder? then	@sourceQueryBuilder.hide()
		@relationTypeSelector.hide()
				
	# editSource: (e) ->
	# 	@selectTab(e)
	# 	@sourceQueryBuilder.show()
	# 	@relationTypeSelector.hide()
	# 	@receptionQueryBuilder.hide()
	
		
	# handleSourceTypeSelected: () ->
	# 	@enableSourceEditorLink()
	# 	@enableSearchButton()
		
	# enableSourceEditorLink: () ->
	# 	@$('.reception-query.relation-type').removeClass('disabled')
		
	# enableSearchButton: () ->
	# 	@$('.search-receptions').removeClass('disabled')

	# selectTab: (e) ->
	# 	@$('.selected').removeClass 'selected'
	# 	@$(e.currentTarget).addClass 'selected'

	# search: (e) ->
	# 	@$el.addClass 'searching'

	# 	queryParameters =
	# 		sourceSearchId: @sourceQueryBuilder.getSearchId()
	# 		targetSearchId: @receptionQueryBuilder.getSearchId()
	# 		relationTypeIds: @relationTypeSelector.getSelectedRelationTypeIds()
	# 		typeString: 'wwrelation'

	# 	result = @receptionSearchQueryExecutor.executeQuery(queryParameters, @receptionSearchResult)

	createEventBus: () ->
		eventBus = {}
		_.extend(eventBus, Backbone.Events)

	render: ->
		@$el.html @template()
		$queryEditor = @$('.query-editor')
		
		@receptionQueryBuilder.render $queryEditor
		@sourceQueryBuilder.render $queryEditor
		
		@receptionSearchResult.render @$('.reception-results')

module.exports = ReceptionSearch