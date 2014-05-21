Backbone = require 'backbone'
$ = require 'jquery'
_ = require 'underscore'

baseTemplate = require '../templates/views/base.jade'
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

ReceptionSearchView = require './views/reception/searcher.coffee'
RelationTypeSelectorView = require './views/relation-type-selector.coffee'
ReceptionEditorView = require './views/reception/editor.coffee'

class App extends Backbone.View
	template: baseTemplate
	initialize: ->
		_.extend @, Backbone.Events
		@render()

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
			relationTypeSelector: new RelationTypeSelectorView()
			receptionEditor: new ReceptionEditorView()
		@receptionSearch.render()
		@showSearch()
		@personSearch?.$el.fadeOut 75
		@documentSearch?.$el.fadeOut 75
		@receptionSearch.$el.fadeIn 75

	showPersonView: (id, rev) ->
		person = new Person _id: id
		person.fetch().done =>
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

	showSearch: ->
		@$('#search').show()
		@$('#view').hide()
		
	showView: ->
		@$('#search').hide()
		@$('#view').show()
		
	switchView: (view) ->
		@currentView?.remove()
		@$('#view').html view.el
		@currentView = view

	render: ->
		wrapper = $('<div/>').attr(class: 'body-wrap').append @$el.html()
		html = $ @template()

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