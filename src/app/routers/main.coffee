Backbone = require 'backbone'
_ = require 'underscore'

class MainRouter extends Backbone.Router
	routes:
		'persons(/)':         'showPersonSearch'
		'persons/:id(/)':     'showPersonView'
		'persons/:id/edit':   'showPersonForm'
		'documents(/)':       'showDocumentSearch'
		'documents/:id(/)':   'showDocumentView'
		'sources/:id(/)':     'showSourceView'
		'documents/:id/edit': 'showDocumentForm'
		'sources(/)':         'showSourceList'
		'receptions(/)':      'showReceptionSearch'
		'':                   'home'

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