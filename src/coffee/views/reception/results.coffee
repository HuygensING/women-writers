Backbone = require  'backbone'
$ = require 'jquery'

config = require '../../config'

class ReceptionSearchResult extends Backbone.View
	template: require '../../../jade/views/reception/search-result.jade'

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

			@$el.html @template
				response: response.attributes
				config: config
				relIds: relIds
	
module.exports = ReceptionSearchResult