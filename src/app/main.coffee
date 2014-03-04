Backbone = require 'backbone'
$ = require 'jquery'
Backbone.$ = $

App = require './views/app.coffee'

$ ->
	app = new App el: 'body'