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
	$.getJSON(config.allPersonsUrl() + '?start=0&rows=1000').then (data) ->
		config.set allPersons: new PersonsCollection data
		$.getJSON(config.allWorksUrl())
	.then (data) ->
		config.set allWorks: new WorksCollection data
	.then ->
		$.getJSON config.get('baseUrl') + '/api/system/relationtypes?iname=wwperson'
	.then (data) ->
		relationTypes = {}
		relationTypes[t.regularName] = t for t in data
		config.set relationTypes: relationTypes
		console.log "REL TYPES", config.get 'relationTypes'
	.then ->
		searchQuery
			query:
				term: '*'
				typeString: 'wwlanguage'
			options:
				searchUrl: config.searchUrl()
				resultRows: 1000 # or any large number
	.then (data) ->
		languages = (value: l._id, label: l.name for l in data.results)
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
		locations = (l for l in data.results)
		config.set locations: locations


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