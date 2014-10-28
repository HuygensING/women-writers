Backbone = require  'backbone'
$ = require 'jquery'

config = require '../../config'

class ReceptionSearchResult extends Backbone.View
	template: require '../../../templates/views/reception/search-result.jade'

	initialize: (options={}) ->
		_.extend @, Backbone.Events

		@listenTo @collection, 'change:results', => @render()

		@render()

	events:
		'click .next': 'clickNext'
		'click .prev': 'clickPrev'
		'click .num-rows li': 'clickNumberOfResultRows'
	
	clickNext: -> @collection.moveCursor '_next'
	clickPrev: -> @collection.moveCursor '_prev'

	queryId: ->
		[..., id] = @collection.postURL?.split '/'
		id

	# triggers a change listened to by the search service,
	# which triggers a 'change:results' on the collection,
	# causing a re-render
	clickNumberOfResultRows: (e) ->
		numResults = $(e.currentTarget).attr 'data-result-rows'
		@trigger 'change:number-of-result-rows', numResults

	render: ->
		response = @collection.current
		if response?
			relIds = {}
			relIds[relation._id] = relation for relation in response.attributes.results

			# TODO: No longer use response.results
			@$el.html @template
				response: response.attributes
				excelUrl: config.excelResultsUrl(@queryId())
				config: config
				relIds: relIds
	
module.exports = ReceptionSearchResult