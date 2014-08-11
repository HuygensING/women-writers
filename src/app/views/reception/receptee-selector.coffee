Backbone = require 'backbone'

# ReceptionSearchCreator = require '../../helpers/reception-search-creator'

class RecepteeSelector extends Backbone.View
	template: require '../../../templates/views/reception/source-query-builder.jade'
	className: 'query-builder'
		
	initialize: (options= {}) ->
		@render()
		
	events:
		'click .close-button': 'handleCloseButtonClick'
		'click button': 'sourceTypeSelected'
		
	render: ->
		@$el.html @template()
	
	handleCloseButtonClick: () ->
		@hide()
		@$el.trigger('queryBuilderCloseEvent')
	
	hide: -> @$el.addClass 'hidden'
	show: ->
		console.log "Calling show"
		@$el.removeClass 'hidden'
	
	# renderSearch: (value) ->
	# 	if @receptionSearch?
	# 		@receptionSearch.remove()
		
	# 	@receptionSearch = @receptionSearchCreator.create(value)
				
	# 	@receptionSearch.render(@$el)
	# 	@receptionSearch.show()
		
	# getSearchId: () ->
	# 	return @receptionSearch.getSearchId()

module.exports = RecepteeSelector