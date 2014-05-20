Backbone = require 'backbone'
_ = require 'underscore'

class MainRouter extends Backbone.Router
	routes:
		'person(/)':					'showPersonSearch'
		'person/:id':					'showPersonForm'
		'person/:id/view': 		'showPersonView'
		'document(/)':				'showDocumentSearch'
		'document/:id':				'showDocumentForm'
		'document/:id/view': 	'showDocumentView'
		'reception(/)':				'showReceptionSearch'
		'':										'home'

	initialize: (options) ->
		super

		{@controller, @root} = options
		@processRoutes()

	start: ->
		Backbone.history.start
			root: @root
			pushState: true 

	processRoutes: ->
		for route, methodName of @routes when methodName of @controller
			method = _.bind @controller[methodName], @controller
			@route route, methodName, method

module.exports = MainRouter