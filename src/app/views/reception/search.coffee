Backbone = require 'backbone'
_ = require 'underscore'

# ReceptionDocumentSearch = require './document-search'
# ReceptionPersonSearch = require './person-search'

ReceptionTypeSelector = require './type-selector'
ReceptionSelector = require './reception-selector'
RecepteeSelector = require './receptee-selector'


ReceptionSearchResult = require './search-result'
RelationSearchQueryExecutor = require '../../helpers/relation-search-query-executor'

# User starts by selecting a reception type, e.g. "biography"
# doing so, he implicitly determines the type of the receptee:
# choosing "biography" implies the receptee is a person, choosing
# other type may imply the receptee is a work.
#
# The reception is always work.
#
# So after selecting the type of reception, the type of receptee
# can be determined, and both the receptee and reception options
# slide into view, allowing the user to make further specifications.
# For example, choosing "biography", allows the user then to
# specify receptions from The Netherlands, and then to specify
# that the receptee should be women born in the 1900s.

class ReceptionSearch extends Backbone.View
	template: require '../../../templates/views/reception/search.jade'
	className: 'reception-search'
	
	events:
		'click .tab.type': -> @selectTab 'type'
		'click .tab.reception': -> @selectTab 'reception'
		'click .tab.receptee': -> @selectTab 'receptee'
		'click .tab.search .search-receptions': 'search'

	initialize: (options) ->
		_.extend @, Backbone.Events

		@model = new Backbone.Model

		# @receptionSearchQueryExecutor = new RelationSearchQueryExecutor eventBus: @eventBus 
		# @eventBus.on 'searchDoneEvent', =>
		# 	@$el.removeClass 'searching'
		# 	@$('.query-editor').slideUp()
		
		# @eventBus.on('sourceTypeSelectedEvent', () =>
		# 	@handleSourceTypeSelected()
		# )

		@tabs = []
		@types = []

		# These will contain the search query result ID
		@receptionSearchId = null
		@recepteeSearchId = null

		@render()

	# selectReceptionOn: (e) ->
	# 	searchType = e.currentTarget.getAttribute 'data-type'
	# 	@$('.source .link').text searchType
	# 	@$('.query').addClass 'reception-on-selected'
	# editSource: (e) ->
	# 	@selectTab e
	# 	@sourceQueryBuilder.show()
	# 	@receptionQueryBuilder.hide()
	# handleSourceTypeSelected: () ->
	# 	@enableSourceEditorLink()
	# 	@enableSearchButton()
	# enableSourceEditorLink: () ->
	# 	@$('.reception-query.relation-type').removeClass('disabled')
	# enableSearchButton: () ->
	# 	@$('.search-receptions').removeClass('disabled')

	setTypeSelected: -> @$('.tabs').addClass 'type-selected'

	selectType: (type) ->
		if @types.indexOf(type) is -1
			@types.push type
			@setTypeSelected()
			@renderTypeTab()

	deselectType: (type) ->
		idx = @types.indexOf type
		@types.splice idx, 1
		@renderTypeTab()

	selectTab: (tab) ->
		@$('.tabs .tab.selected').removeClass 'selected'
		@$(".tabs .tab.#{tab}").addClass 'selected'

		for name, view of @tabs when name isnt tab
			console.log name, view, tab
			view.hide()

		console.log "Showing #{tab}", @tabs[tab]

		@tabs[tab].show()

	# search: (e) ->
	# 	@$el.addClass 'searching'

	# 	queryParameters =
	# 		sourceSearchId: @sourceQueryBuilder.getSearchId()
	# 		targetSearchId: @receptionQueryBuilder.getSearchId()
	# 		relationTypeIds: @relationTypeSelector.getSelectedRelationTypeIds()
	# 		typeString: 'wwrelation'

	# 	result = @receptionSearchQueryExecutor.executeQuery(queryParameters, @receptionSearchResult)

	# createEventBus: () ->
	# 	eventBus = {}
	# 	_.extend(eventBus, Backbone.Events)

	renderTypeTab: ->
		$typeText = @$('.tabs .tab.type .text')

		if @types.length > 3
			text = @types[0..2].join ', '
			text += " <span class=more>and #{@types.length - 3} more</span>"
			$typeText.html text
		else
			$typeText.text @types.join ', '
		
		$typeText.show()

	render: ->
		@$el.html @template()
		$queryEditor = @$('.query-editor')

		@tabs['type'] = @receptionTypeSelector = new ReceptionTypeSelector
			el: @$('.select-type')

		@listenTo @receptionTypeSelector, 'select', (type) => @selectType type
		@listenTo @receptionTypeSelector, 'deselect', (type) => @deselectType type

		@tabs['reception'] = @receptionSelector = new ReceptionSelector
			el: @$('.select-reception')

		# @sourceQueryBuilder = new SourceQueryBuilder
		# 	el: @$('.source-query')
		# 	eventBus: @eventBus

		# @receptionSelector.render()
		# @sourceQueryBuilder.render()
		
module.exports = ReceptionSearch