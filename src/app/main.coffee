Backbone = require 'backbone'
$ = Backbone.$ = require 'jquery'

config = require './config.coffee'

App = require './app.coffee'
MainRouter = require './routers/main.coffee'

PersonsCollection = require './collections/persons.coffee'
WorksCollection = require './collections/works.coffee'

{searchQuery} = require './helpers/search'

handleLinkClicks = (e) ->
	href = $(@).attr 'href'	
	if href?
		e.preventDefault()
		href = href.replace config.get('baseUrl'), '' if href.match /^https?:/
		Backbone.history.navigate href, trigger: true

bootstrap = ->
	$.getJSON(config.get('baseUrl') + '/api/system/relationtypes?iname=wwperson').then (data) ->
		relationTypes = {}
		for t in data
			relationTypes[t.regularName] = t
		config.set personRelationTypes: relationTypes
	.then ->
		$.getJSON config.get('baseUrl') + '/api/system/relationtypes?iname=wwdocument'
	.then (data) ->
		relationTypes = {}
		for t in data
			relationTypes[t.regularName] = t
		config.set workRelationTypes: relationTypes
	.then ->
		searchQuery
			query:
				term: '*'
				typeString: 'wwlanguage'
			options:
				searchUrl: config.searchUrl()
				resultRows: 1000 # or any large number
	.then (data) ->
		languages = (value: l.id, label: l.displayName for l in data.refs)
		config.set languages: languages
	.then ->
		searchQuery
			query:
				term: '*'
				typeString: 'wwlocation'
			options:
				searchUrl: config.searchUrl()
				resultRows: 1000
	.then (data) ->
		config.set locations: (value: l.id, label: l.displayName for l in data.refs)
	.then ->
		searchQuery
			query:
				term: '*'
				typeString: 'wwperson'
			options:
				searchUrl: config.searchUrl()
				resultRows: 100
	.then (data) ->
		config.set persons: (value: p.id, label: p.displayName for p in data.refs)
	.then ->
		$.getJSON config.receptionsUrl()
	.then (data) ->
		config.set receptions: data.receptions

$ ->
	$(document).on 'click', 'a:not([target])', handleLinkClicks

	# Check/set security token
	hasHsId = new RegExp /(?:\?|&)hsid=([^&]+)(?:&.+)?$/
	hsid = hasHsId.exec window.location.href
	if hsid
		config.set authToken: hsid[1]
		window.history.replaceState? {}, '', window.location.href.replace /\?.*$/, ''

	bootstrap().done ->
		# All systems go!
		app = new App el: 'body'

		base = config.get('baseUrl').replace /^https?:\/\/[^\/]+/, ''
		mainRouter = new MainRouter
			controller: app
			root: base

		mainRouter.start()