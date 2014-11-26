Backbone = require 'backbone'
$ = require 'jquery'
_ = require 'underscore'

baseTemplate = require '../jade/views/base.jade'
config = require './config.coffee'

user = require './models/user.coffee'

UserStatusView = require './views/user-status.coffee'

Person = require './models/person.coffee'
PersonForm = require './views/person/edit.coffee'
PersonView = require './views/person/view.coffee'
PersonOverview = require './views/person/overview.coffee'
PersonSearchView = require './views/person/search.coffee'	

Document = require './models/document.coffee'
DocumentForm = require './views/document/edit.coffee'
DocumentView = require './views/document/view.coffee'
DocumentOverview = require './views/document/overview.coffee'
DocumentSearchView = require './views/document/search.coffee'	

ReceptionSearchView = require './views/reception/search.coffee'

SourceList = require './views/sources/view'

class App extends Backbone.View
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

	home: -> # TODO: Define what's displayed in home

	showPersonForm: (id) ->
		person = new Person _id: id
		person.fetch().done =>
			view = new PersonForm
				model: person
			@switchView view
		@showView()
	
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

	showPersonView: (id, rev) ->
		person = new Person _id: id
		person.fetch().done =>
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
					view = new PersonView model: person
					@switchView view
					@showView()
			else
				view = new PersonView model: person
				@switchView view
				@showView()

	showDocumentView: (id, rev) ->
		opts = _id: id
		opts['^rev'] = rev if rev?

		document = new Document opts
		document.fetch().done =>
			view = new DocumentView model: document
			@switchView view
			@showView()

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
			model: user

		@$el.html(wrapper)
			.append(html.hide())
			.find('.body-wrap')
			.fadeOut 150, => 
				@$('.body-wrap').remove()
				html.fadeIn 100

module.exports = App