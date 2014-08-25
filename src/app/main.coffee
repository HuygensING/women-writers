Backbone = require 'backbone'
$ = Backbone.$ = require 'jquery'

config = require './config.coffee'
user = require './models/user'

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
	loadedRelationTypesPerson = new $.Deferred()
	$.getJSON(config.get('baseUrl') + '/api/system/relationtypes?iname=wwperson').then (data) ->
		relationTypes = {}
		for t in data
			if t.sourceTypeName is 'person'
				relationTypes[t.regularName] = t
			# should not be else if, because some relations have person as source and target and should be added twice, like isPseudonymOf and hasPseudonym
			if t.targetTypeName is 'person'
				relationTypes[t.inverseName] = t
		config.set personRelationTypes: relationTypes
		
		loadedRelationTypesPerson.resolve()


	loadedRelationTypesDocument = new $.Deferred()
	$.getJSON(config.get('baseUrl') + '/api/system/relationtypes?iname=wwdocument').then (data) ->
		relationTypes = {}
		for t in data
			relationTypes[t.regularName] = t
		config.set documentRelationTypes: relationTypes

		loadedRelationTypesDocument.resolve()

	loadedLanguages = new $.Deferred()
	searchQuery
		query:
			term: '*'
		options:
			searchUrl: config.searchUrl('wwlanguages')
			resultRows: 1000 # or any large number
	.then (data) ->
		languages = (value: l.id, label: l.displayName for l in data.refs)
		config.set languages: languages
		loadedLanguages.resolve()

	loadedLocations = new $.Deferred()
	searchQuery
		query:
			term: '*'
		options:
			searchUrl: config.searchUrl('wwlocations')
			resultRows: 1000
	.then (data) ->
		config.set locations: (value: l.id, label: l.displayName for l in data.refs)
		loadedLocations.resolve()

	loadedPersons = new $.Deferred()
	searchQuery
		query:
			term: '*'
		options:
			searchUrl: config.searchUrl('wwpersons')
			resultRows: 100
	.then (data) ->
		config.set persons: (value: p.id, label: p.displayName for p in data.refs)
		loadedPersons.resolve()

	loadedReceptions = new $.Deferred()
	$.getJSON(config.receptionsUrl()).then (data) ->
		config.set receptions: data.receptions
		loadedReceptions.resolve()

	loadedSources = new $.Deferred()
	searchQuery
		query:
			term: '*'
			facetValues: [
				{ name: 'dynamic_b_is_source', values: ['true'] }
			]
		options:
			searchUrl: config.searchUrl('wwdocuments')
			resultRows: 5000 # 311 sources at time of writing, not likely to grow substantially
	.then (data) ->
		byId = _.groupBy data.results, (r) -> r._id
		config.set sources: (id: s.id, title: s.displayName, notes: byId[s.id][0].notes for s in data.refs)
		loadedSources.resolve()

	# Fetch a resource, set the given config key with the data (id, label)
	loadPromise = (url, key) ->
		promise = new $.Deferred()
		$.getJSON(url).then (data) ->
			config.set key, (value: el._id, label: el.value for el in data)
			promise.resolve()
		promise

	loadedEducations = loadPromise config.educationUrl(), 'educations'
	loadedFinancialSituations = loadPromise config.financialSituationUrl(), 'financialSituations'
	loadedMaritalStatuses = loadPromise config.maritalStatusUrl(), 'maritalStatuses'
	loadedProfessions = loadPromise config.professionUrl(), 'professions'
	loadedReligions = loadPromise config.religionUrl(), 'religions'
	loadedSocialClasses = loadPromise config.socialClassUrl(), 'socialClasses'
	loadedSourceCategories = loadPromise config.sourceCategoryUrl(), 'sourceCategories'

	return $.when(
		loadedRelationTypesPerson,
		loadedRelationTypesDocument,
		loadedLanguages,
		loadedLocations,
		loadedPersons,
		loadedReceptions,
		loadedEducations,
		loadedFinancialSituations,
		loadedMaritalStatuses,
		loadedProfessions,
		loadedReligions,
		loadedSocialClasses,
		loadedSourceCategories,
		loadedSources
	) # so we can call bootstrap().done(...)

$ ->
	$(document).on 'click', 'a:not([target])', handleLinkClicks

	# Check/set security token
	hasHsId = new RegExp /(?:\?|&)hsid=([^&]+)(?:&.+)?$/
	hsid = hasHsId.exec window.location.href
	if hsid
		config.set authToken: hsid[1]
		window.history.replaceState? {}, '', window.location.href.replace /\?.*$/, ''

	bootstrap().done ->
		user.fetch(login: false).always ->
			# All systems go!
			app = new App el: 'body'

			base = config.get('baseUrl').replace /^https?:\/\/[^\/]+/, ''
			mainRouter = new MainRouter
				controller: app
				root: base

			mainRouter.on 'route', (route) => app.updateNavBar route

			config.set 'router', mainRouter

			mainRouter.start()