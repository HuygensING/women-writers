Backbone = require 'backbone'
$ = Backbone.$ = require 'jquery'

config = require './config.coffee'

App = require './app.coffee'
MainRouter = require './routers/main.coffee'

PersonsCollection = require './collections/persons.coffee'
DocumentsCollection = require './collections/documents.coffee'

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
			if t.sourceTypeName is 'person'
				relationTypes[t.regularName] = t
			# should not be else if, because some relations have person as source and target and should be added twice, like isPseudonymOf and hasPseudonym
			if t.targetTypeName is 'person'
				relationTypes[t.inverseName] = t
		config.set personRelationTypes: relationTypes
	.then ->
		$.getJSON config.get('baseUrl') + '/api/system/relationtypes?iname=wwdocument'
	.then (data) ->
		relationTypes = {}
		for t in data
			relationTypes[t.regularName] = t
		config.set documentRelationTypes: relationTypes
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
	.then ->
		$.getJSON config.educationUrl()
	.then (data) ->
		config.set educations: (value: e._id, label: e.value for e in data)
	.then ->
		$.getJSON config.financialSituationUrl()
	.then (data) ->
		config.set financialSituations: (value: f._id, label: f.value for f in data)	
	.then ->
		$.getJSON config.maritalStatusUrl()
	.then (data) ->
		config.set maritalStatuses: (value: m._id, label: m.value for m in data)
	.then ->
		$.getJSON config.professionUrl()
	.then (data) ->
		config.set professions: (value: p._id, label: p.value for p in data)
	.then ->
		$.getJSON config.religionUrl()
	.then (data) ->
		config.set religions: (value: r._id, label: r.value for r in data)
	.then ->
		$.getJSON config.socialClassUrl()
	.then (data) ->
		config.set socialClasses: (value: s._id, label: s.value for s in data)

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