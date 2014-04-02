Backbone = require 'backbone'
$ = require 'jquery'
_ = require 'underscore'

baseTemplate = require '../templates/views/base.jade'
config = require './config.coffee'

user = require './models/user.coffee'

UserStatusView = require './views/user-status.coffee'

# personDescription = require '../../data/wwperson.json'
# Form = require 'timbuctoo-edit-forms/src/coffee/views/form.coffee'
# {createTimbuctooSchema}  = require 'timbuctoo-edit-forms/src/coffee/helpers.coffee'

Person = require './models/person.coffee'
PersonForm = require './views/person.coffee'
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
		@$('#search').hide()
		@$('#view').show()
		
	showPersonForm: (id) ->
		person = new Person _id: id
		person.fetch().done =>
			view = new PersonForm
				model: person
			@switchView view
		@$('#search').hide()
		@$('#view').show()
	
	showWorkOverview: ->
		new WorkOverview el: '#view'
		@$('#search').hide()
		@$('#view').show()

	showWorkForm: (id) ->
		work = new Work _id: id
		work.fetch().done =>
			view = new WorkForm
				model: work
			@switchView view
		@$('#search').hide()
		@$('#view').show()

	showPersonSearch: ->
		@personSearch ?= new PersonSearchView
			el: '#search .persons'
		@$('#search').show()
		@$('#view').hide()
		@workSearch?.$el.fadeOut 75, =>
			@personSearch.$el.fadeIn 75

	showWorkSearch: ->
		@workSearch ?= new WorkSearchView
			el: '#search .works'
		@$('#search').show()
		@$('#view').hide()
		@personSearch?.$el.fadeOut 75, =>
			@workSearch.$el.fadeIn 75

	switchView: (view) ->
		console.log "Switching to", view.el
		@currentView?.remove()
		@$('#view').html view.el
		console.log "View is", view.el
		# view.$el.fadeIn 75, => @currentView = view

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