Backbone = require 'backbone'
$ = Backbone.$ = require 'jquery'

config = require './config.coffee'

App = require './app.coffee'
MainRouter = require './routers/main.coffee'

PersonsCollection = require './collections/persons.coffee'
WorksCollection = require './collections/works.coffee'

$ ->
	$(document).on 'click', 'a:not([target])', (e) ->
		href = $(@).attr 'href'	
		if href?
			e.preventDefault()
			Backbone.history.navigate href, trigger: true

	$.getJSON(config.allPersonsUrl() + '?start=14847&rows=200').then (data) ->
		config.set allPersons: new PersonsCollection data
		
		# config.allWorksUrl()
		#.then (data) ->
		#	config.set allWorks: new WorksCollection data
	.done ->
		# All systems go!
		app = new App el: 'body'

		base = config.get('baseUrl').replace /^https?:\/\/[^\/]+/, ''
		mainRouter = new MainRouter
			controller: app
			root: base

		mainRouter.start()