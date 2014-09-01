Backbone = require 'backbone'
_ = require 'underscore'

SearchResults = require 'huygens-faceted-search/src/coffee/collections/searchresults'

config = require '../../config'

# ReceptionDocumentSearch = require './document-search'
# ReceptionPersonSearch = require './person-search'

ReceptionTypeSelector = require './type-selector'
ReceptionSelector = require './reception-selector'
RecepteeSelector = require './receptee-selector'

ReceptionResultsView = require './results'

ReceptionService = require '../../helpers/reception-service'

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

	numRows: 100 # default number of result rows to display

	events:
		'click .tab.type': -> @selectTab 'type'
		'click .tab.reception': -> @selectTab 'reception'
		'click .tab.receptee': -> @selectTab 'receptee'
		'click .tab.search .search-receptions': 'search'

	initialize: (options) ->
		_.extend @, Backbone.Events

		@model = new Backbone.Model

		@receptionService = new ReceptionService

		@query = null
		@tabs = {}
		@types = []
		@recepteeType = null

		# Cache/collection for storing our results
		@searchResults = new SearchResults
			config:
				resultRows: 100
				baseUrl: config.get 'baseUrl'
				searchPath: config.get 'relationSearchPath'

		# These will contain the search query result ID
		@receptionSearchId = null
		@recepteeSearchId = null

		# Type
		@tabs['type'] = @receptionTypeSelector = new ReceptionTypeSelector
			
		# Reception (always a 'work')
		@tabs['reception'] = @receptionSelector = new ReceptionSelector
		@listenTo @receptionSelector, 'change', => @renderReceptionTab()

		# Receptee (either work or person, depends on reception types selected)
		@tabs['receptee'] = @recepteeSelector = new RecepteeSelector
		@listenTo @recepteeSelector, 'change', => @renderRecepteeTab()

		@listenTo @receptionTypeSelector, 'change', (selection) =>
			@changeType selection
			@recepteeSelector.setType selection.category
			@renderRecepteeTab()

		@render()

	setTypeSelected: -> @$('.tabs').addClass 'type-selected'

	changeType: (selection) ->
		@types = selection.types
		@setRecepteeType selection.category
		@setTypeSelected()
		@renderTypeTab()

	setRecepteeType: (type) ->
		@recepteeType = type
		# @recepteeSelector
		@renderRecepteeTab()

	selectTab: (tab) ->
		@$('.tabs .tab.selected').removeClass 'selected'
		@$(".tabs .tab.#{tab}").addClass 'selected'

		for name, view of @tabs when name isnt tab
			view.hide()

		@$('.views').removeClass 'slide-up'
		@tabs[tab].show()

	search: (e) ->
		@$el.addClass 'searching'
		@$('.views').addClass 'slide-up'

		recepteeId = @recepteeSelector.getQueryId()
		receptionId = @receptionSelector.getQueryId()
		typeIds = (t.id for t in @types)
		console.log "Searching", receptionId, recepteeId, typeIds

		@query =
			sourceSearchId: recepteeId
			targetSearchId: receptionId
			relationTypeIds: typeIds
			typeString: 'wwrelation'

		@receptionService.search(@query, @numRows).done (data) =>
			@searchResults.addModel data, JSON.stringify @query
		.fail -> console?.error "Failed searching receptions", arguments

	renderTypeTab: ->
		$typeText = @$('.tabs .tab.type .text')

		toNiceName = (r) -> config.receptionTypeLabel r.name

		if @types.length > 3
			text = @types[0..2].map(toNiceName).join ', '
			text += " <span class=more>and #{@types.length - 3} more</span>"
			$typeText.html text
		else
			$typeText.text @types.map(toNiceName).join ', '
		
		$typeText.show()

	renderReceptionTab: ->
		$receptionText = @$('.tabs .tab.reception .text')
		$receptionLink = @$('.tabs .tab.reception .link')
		values = @receptionSelector.getValues()

		facetTitles = config.get 'documentFacetTitles'

		text = "with "

		for facet in values
			name = facetTitles[facet.name] ? facet.name
			text += name.toLowerCase()
			text += 's' if facet.values.length > 1
			text += ' ' + facet.values.join ', '
			text += '; '

		text = text.replace /; $/, ''
		$receptionText.text(text).show()
		$receptionLink.hide()

	renderRecepteeTab: ->
		$recepteeText = @$('.tabs .tab.receptee .text')
		$recepteeLink = @$('.tabs .tab.receptee .link')

		if @recepteeType is 'work'
			facetTitles = config.get 'documentFacetTitles'
		else
			facetTitles = config.get 'personFacetTitles'

		values = @recepteeSelector.getValues()

		text  = 'on '
		text += 'all ' if values.length is 0
		text += @recepteeType + 's'

		if values.length
			text += ' with '
			for facet in values
				name = facetTitles[facet.name] ? facet.name
				text += name.toLowerCase()
				text += ' ' + facet.values.join ', '
				text += '; '

		$recepteeText.text text

		$recepteeText.text(text).show()
		$recepteeLink.hide()

	render: ->
		@$el.html @template()
		$queryEditor = @$('.query-editor')

		@receptionTypeSelector.setElement @$('.select-type')
		@receptionTypeSelector.render()
		@receptionSelector.setElement @$('.select-reception')
		@receptionSelector.render()
		@recepteeSelector.setElement @$('.select-receptee')
		@recepteeSelector.render()

		@resultsView = new ReceptionResultsView
			collection: @searchResults
			el: @$('.reception-results')
		@listenTo @resultsView, 'change:number-of-result-rows', (numRows) =>
			@receptionService.setResultRows(numRows).done (data) =>
				@searchResults.addModel data, JSON.stringify @query

module.exports = ReceptionSearch