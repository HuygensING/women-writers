Backbone = require 'backbone'
_ = require 'underscore'

class MainRouter extends Backbone.Router
	routes:
		'person':							'showPersonOverview'
		'person/search/':			'showPersonSearch'
		'person/:id':					'showPersonForm'
		'work': 							'showWorkOverview'
		'work/search/':				'showWorkSearch'
		'work/:id':						'showWorkForm'
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