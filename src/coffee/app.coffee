Backbone = require 'backbone'
$ = require 'jquery'
_ = require 'underscore'
React = require "react"

baseTemplate = require '../jade/views/base.jade'
config = require './config'

UserStatusView = require './views/user-status'

Person = require './models/person'
# PersonForm = require './views/person/edit'
PersonForm = require "../edit-person/build/development"
PersonView = require './views/person/view'
PersonGraphView = require './views/person/graph'
PersonSearchView = require './views/person/search'

Document = require './models/document'
DocumentForm = require './views/document/edit'
DocumentView = require './views/document/view'
DocumentSearchView = require './views/document/search'

ReceptionSearchView = require './views/reception/search'

SourceList = require './views/sources/view'

Modal = require 'hibb-modal'
addPersonTpl = require '../jade/views/person/add.jade'
addDocumentTpl = require '../jade/views/document/add.jade'

class App extends Backbone.View
	className: 'container'
	template: baseTemplate

	initialize: ->
		_.extend @, Backbone.Events
		@render()

	updateNavBar: (route) ->
		match = route.match /show([A-Z][a-z]+)/
		if match
			category = match[1].toLowerCase()
			@$('.navigation a').removeClass 'active'
			@$(".navigation a.#{category}").addClass 'active'

	events:
		'click i.fa.fa-adjust': 'toggleHighContrast'
		'click span.add-person': '_showAddPersonModal'
		'click span.add-document': '_showAddDocumentModal'

	_showAddPersonModal: ->
		modal = new Modal
			customClassName: "add-person-modal"
			title: "Add person"
			html: $('<div />').html(addPersonTpl())
			submitValue: 'Save'

		modal.on 'submit', =>
			formData = modal.$("form").serializeArray()

			if formData["last-name"] is ""
				modal.message("error", "A person should have a last name.")
			else
				url = new Person().url()

				cb = (response, textStatus, jqXHR) =>
					console.log response, textStatus
					modal.messageAndFade 'success', 'Person saved!'
				$.ajax
					url: url
					type: "POST"
					data: new Person().parseFormData(formData)
					success: cb
					contentType: "application/json"
					headers:
						VRE_ID: "WomenWriters"
						Authorization: localStorage.getItem("hi-womenwriters-auth-token")


	_showAddDocumentModal: ->
		showModal = =>
			rhtml = addDocumentTpl
				genres: _.sortBy(config.get("genres"), "label")
				languages: _.sortBy(config.get("languages"), "label")
				persons: _.sortBy(config.get("persons"), "displayName")
				locations: _.sortBy(config.get("locations"), "displayName")

			modal = new Modal
				customClassName: "add-document-modal"
				title: "Add document"
				html: $('<div />').html(rhtml)
				submitValue: 'Save'

			modal.on 'submit', =>
				formData = modal.$("form").serializeArray()

				if formData.title is ""
					modal.message("error", "A document should have a title.")
				else
					doc = new Document()

					saveDocumentRelations = (sourceId) =>
						jqXHRs = []

						for relationName in ["isCreatedBy", "hasWorkLanguage", "hasGenre", "hasPublishLocation"]

						# jqXHRs = ["isCreatedBy", "hasWorkLanguage", "hasGenre", "hasPublishLocation"].map (relationName) =>
							field = formData.filter (formField) ->
								formField.name is relationName

							if field[0].value isnt ""
								jqXHRs.push	doc.saveRelation(relationName, sourceId, field[0].value)

						if jqXHRs.length
							$.when.apply($, jqXHRs).done =>
								modal.messageAndFade 'success', 'Document saved!'
						else
							modal.messageAndFade 'success', 'Document saved!'

					$.ajax
						url: doc.url()
						type: "POST"
						data: doc.parseFormData(formData)
						success: (response, textStatus, xhr) =>
							docLoc = xhr.getResponseHeader("Location")
							docId = docLoc.substr (docLoc.lastIndexOf("/") + 1)
							saveDocumentRelations(docId)
						contentType: "application/json"
						headers:
							VRE_ID: "WomenWriters"
							Authorization: localStorage.getItem("hi-womenwriters-auth-token")

		if config.has("persons") and config.has("locations")
			showModal()
		else
			loader = new Modal
				html: "Please wait, loading..."
				cancelAndSubmit: false

			formData =
				type: "POST"
				data: '{"term": "*"}'
				contentType: "application/json; charset=UTF-8"
				headers:
					VRE_ID: "WomenWriters"

			fetchPersons = new $.Deferred()
			fetchLocations = new $.Deferred()

			jqXHRPostPersons = $.ajax _.extend formData,
				url: "https://acc.repository.huygens.knaw.nl/v1/search/wwpersons"

			jqXHRPostPersons.done (response, textStatus, xhr) =>
				jqXHRGetPersons = $.ajax
					url: xhr.getResponseHeader("Location") + "?rows=10000"

				jqXHRGetPersons.done (response) =>
					fetchPersons.resolve response

			jqXHRPostLocations = $.ajax _.extend formData,
				url: "https://acc.repository.huygens.knaw.nl/v1/search/wwlocations"

			jqXHRPostLocations.done (response, textStatus, xhr) =>
				jqXHRGetLocations = $.ajax
					url: xhr.getResponseHeader("Location") + "?rows=200"

				jqXHRGetLocations.done (response) =>
					fetchLocations.resolve response

			$.when(fetchPersons, fetchLocations).done (persons, locations) =>
				loader.destroy()

				config.set "persons", persons.refs
				config.set "locations", locations.refs

				showModal()


	toggleHighContrast: (ev) ->
		$('body').toggleClass 'high-contrast'

	# TODO: Define what's displayed in home
	home: ->

	showPersonForm: (id) ->
		console.log "SHOW: ", id

		Factory = React.createFactory(PersonForm)
		React.render Factory(), document.getElementById("view")

		@showView()
		# person = new Person _id: id
		# person.fetch().done =>
		# 	view = new PersonForm
		# 		model: person
		# 	@switchView view
		# @showView()

	showDocumentForm: (id) ->
		document = new Document _id: id
		document.fetch().done =>
			view = new DocumentForm
				model: document
			@switchView view
		@showView()

	showPersonSearch: ->
		@personSearch ?= new PersonSearchView
			el: '#search .persons'
		@showSearch()
		@documentSearch?.$el.fadeOut 75
		@receptionSearch?.$el.fadeOut 75
		@personSearch.$el.fadeIn 75

	showDocumentSearch: ->
		@documentSearch ?= new DocumentSearchView
			el: '#search .documents'
		@showSearch()
		@personSearch?.$el.fadeOut 75
		@receptionSearch?.$el.fadeOut 75
		@documentSearch.$el.fadeIn 75

	showReceptionSearch: ->
		@receptionSearch ?= new ReceptionSearchView
			el: '#search .receptions'

		@showSearch()
		@personSearch?.$el.fadeOut 75
		@documentSearch?.$el.fadeOut 75
		@receptionSearch.$el.fadeIn 75

	showPersonView: (id, version) ->
		person = new Person _id: id
		showPerson = =>
			if 'hasPseudonym' of person.get('@relations')
				# We want to display all the pseudonym-linked
				# works on the 'real' author page, so we need
				# to load those, and insert them into the model
				# before rendering the view. It's a bit of a
				# hack, but this really should have been done
				# server-side within the context of the VRE, because
				# now we have to fetch entire objects, when all we
				# really want is a list of works linked to each pseudonym
				person.set pseudonyms: {}

				pseudonymsLoaded = for p in person.get('@relations').hasPseudonym
					pseudonym = new Person _id: p.id
					pseudonym.fetch()

				Backbone.$.when(pseudonymsLoaded...).done (results...) =>
					for r in results
						[pseudonym] = r
						if pseudonym?['@relations']?['isCreatorOf']?.length
							person.get('pseudonyms')[pseudonym._id] = pseudonym
					view = new PersonView
						model: person
						showingRevision: version?
					@switchView view
					@showView()
			else
				view = new PersonView
					model: person
					showingRevision: version?
				@switchView view
				@showView()

		fetchPerson = if version?
			person.fetchVersion(version)
		else
			person.fetch()
		fetchPerson.done => showPerson()

	showPersonGraph: (id) ->
		person = new Person _id: id
		showGraph = =>
			view = new PersonGraphView
				model: person
			@switchView view
			@showView()

		person.fetch().done => showGraph()

	showDocumentView: (id, version) ->
		document = new Document _id: id
		showDocument = =>
			view = new DocumentView
				model: document
				showingRevision: version?
			@switchView view
			@showView()

		fetchDocument = if version?
			document.fetchVersion(version)
		else
			document.fetch()
		fetchDocument.done =>
			showDocument()

	showSourceView: -> @showDocumentView arguments...

	showSourceList: ->
		view = new SourceList
		@switchView view
		@showView()

	showSearch: ->
		@$('#search').show()
		@$('#view').hide()

	showView: ->
		@$('#search').hide()
		@$('#view').show()

		@$el.scrollTop 0

	switchView: (view) ->
		@currentView?.remove()
		@$('#view').html view.el
		@currentView = view

	render: ->
		wrapper = $('<div/>').attr(class: 'body-wrap').append @$el.html()
		html = $ @template config: config

		new UserStatusView
			el: html.find '.user-status'

		@$el.html(wrapper)
			.append(html.hide())
			.find('.body-wrap')
			.fadeOut 150, =>
				@$('.body-wrap').remove()
				html.fadeIn 100

		@

module.exports = App