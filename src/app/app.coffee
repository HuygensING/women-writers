Backbone = require 'backbone'
$ = require 'jquery'
_ = require 'underscore'

baseTemplate = require '../templates/views/base.jade'
config = require './config.coffee'

user = require './models/user.coffee'

UserStatusView = require './views/user-status.coffee'

Person = require './models/person.coffee'
PersonForm = require './views/person.coffee'
PersonOverview = require './views/person-overview.coffee'
PersonSearchView = require './views/person-search.coffee'	

Document = require './models/document.coffee'
DocumentForm = require './views/document.coffee'
DocumentOverview = require './views/document-overview.coffee'
DocumentSearchView = require './views/document-search.coffee'	

ReceptionSearchView = require './views/reception-searcher.coffee'
RelationTypeSelectorView = require './views/relation-type-selector.coffee'
ReceptionDocumentSearchView = require './views/reception-document-search.coffee'
ReceptionSearchResult = require './views/reception-search-result'
ReceptionSearchCreator = require './helpers/reception-search-creator'
RelationSearchQueryExecutor = require './helpers/relation-search-query-executor'

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
			receptionQueryBuilder: new ReceptionDocumentSearchView()
			receptionSearchCreator: new ReceptionSearchCreator()
			receptionSearchResult: new ReceptionSearchResult()
			receptionSearchQueryExecutor: new RelationSearchQueryExecutor()
			
		@receptionSearch.render()
		@showSearch()
		@personSearch?.$el.fadeOut 75
		@documentSearch?.$el.fadeOut 75
		@receptionSearch.$el.fadeIn 75
		
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