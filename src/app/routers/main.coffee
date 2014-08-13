Backbone = require 'backbone'
_ = require 'underscore'

class MainRouter extends Backbone.Router
	routes:
		'person(/)':					'showPersonSearch'
		'person/:id(/)':			'showPersonView'
		'person/:id/edit':		'showPersonForm'
		'document(/)':				'showDocumentSearch'
		'document/:id(/)':		'showDocumentView'
		'document/:id/edit':	'showDocumentForm'
		'sources(/)':					'showSourceList'
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

	processRoutes: -> # delegate all routes to the controller (app.coffee, in our case)
		for route, methodName of @routes when methodName of @controller
			method = _.bind @controller[methodName], @controller
			@route route, methodName, method

module.exports = MainRouter