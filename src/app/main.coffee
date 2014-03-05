Backbone = require 'backbone'
$ = require 'jquery'
Backbone.$ = $

App = require './views/app.coffee'
MainRouter = require './routers/main.coffee'

$ ->
	app = new App
		el: 'body'

	mainRouter = new MainRouter
	Backbone.history.start pushState: true

	$(document).on 'click', 'a:not([target])', (e) ->
		href = $(@).attr 'href'
		
		if href?
			e.preventDefault()
			Backbone.history.navigate href, trigger: true