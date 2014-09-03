# This module loads data needed for the app to edit persons
# and documents, mainly list options. It returns a promise
# that resolves once all data is loaded

Backbone = require 'backbone'
$ = Backbone.$ = require 'jquery'

config = require '../config'
user = require '../models/user'

{searchQuery} = require './search'

module.exports = ->
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
	loadedGenres = loadPromise config.genreUrl(), 'genres'

	return $.when(
		loadedRelationTypesPerson,
		loadedRelationTypesDocument,
		loadedLanguages,
		loadedLocations,
		loadedPersons,
		loadedEducations,
		loadedFinancialSituations,
		loadedMaritalStatuses,
		loadedProfessions,
		loadedReligions,
		loadedSocialClasses,
		loadedGenres
	) # so we can call bootstrap().done(...)