Backbone = require 'backbone'
_ = require 'underscore'

routes = require '../../../config/routes.json'

class MainRouter extends Backbone.Router
	routes: routes

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