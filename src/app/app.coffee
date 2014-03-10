Backbone = require 'backbone'
$ = require 'jquery'
_ = require 'underscore'

baseTemplate = require '../templates/views/base.jade'
config = require './config.coffee'

# personDescription = require '../../data/wwperson.json'
# Form = require 'timbuctoo-edit-forms/src/coffee/views/form.coffee'
# {createTimbuctooSchema}  = require 'timbuctoo-edit-forms/src/coffee/helpers.coffee'

Person = require './models/person.coffee'
PersonView = require './views/person.coffee'
PersonOverview = require './views/person-overview.coffee'
PersonSearchView = require './views/person-search.coffee'	

Work = require './models/work.coffee'
WorkForm = require './views/work.coffee'
WorkOverview = require './views/work-overview.coffee'
WorkSearchView = require './views/work-search.coffee'	

class App extends Backbone.View
	template: baseTemplate
	initialize: ->
		_.extend @, Backbone.Events
		@render()

	showPersonOverview: ->
		new PersonOverview el: '#view'
		
	showPersonForm: (id) ->
		person = new Person _id: id
		person.fetch().done =>
			pv = new PersonView model: person
			@switchView pv
	
	showWorkOverview: ->
		new WorkOverview el: '#view'
		
	showWorkForm: (id) ->
		work = new Work _id: id
		work.fetch().done =>
			new WorkForm el: '#view', model: work

	showPersonSearch: ->
		@personSearch ?= new PersonSearchView
		@switchView @personSearch

	showWorkSearch: ->
		@workSearch ?= new WorkSearchView
		@switchView @workSearch

	switchView: (view) ->
		@currentView?.$el.fadeOut 75
		view.$el.fadeOut 0
		@$('#view').html view.el
		view.$el.fadeIn 75
		@currentView = view

	render: ->
		wrapper = $('<div/>').attr(class: 'body-wrap').append @$el.html()
		html = $ @template()
		@$el.html(wrapper)
			.append(html.hide())
			.find('.body-wrap')
			.fadeOut 150, => 
				@$('.body-wrap').remove()
				html.fadeIn 100

module.exports = App