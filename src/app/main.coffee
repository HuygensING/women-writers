Backbone = require 'backbone'
$ = Backbone.$ = require 'jquery'

config = require './models/config.coffee'

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

	$.getJSON(config.allPersonsURL()).then (data) ->
		config.set allPersons: new PersonsCollection data
		
		$.getJSON config.allWorksURL()
	.then (data) ->
		config.set allWorks: new WorksCollection data
	.done ->
		# All systems go!
		app = new App el: 'body'

		base = config.get('baseUrl').replace /^https?:\/\/[^\/]+/, ''
		mainRouter = new MainRouter
			controller: app
			root: base

		mainRouter.start()