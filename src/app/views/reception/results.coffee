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
	
	clickNext: -> @collection.moveCursor '_next'
	clickPrev: -> @collection.moveCursor '_prev'

	# update: (result = {}) ->
	# 	relIds = {}
	# 	relIds[relation._id] = relation for relation in result.results

	# 	@$el.html @template
	# 		response: result
	# 		relIds: relIds
	# 		config: config
	# 	@parentElement.append(@$el)
		
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