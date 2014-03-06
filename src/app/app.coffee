Backbone = require 'backbone'
$ = require 'jquery'
_ = require 'underscore'

baseTemplate = require '../templates/views/base.jade'
config = require './models/config.coffee'

# personDescription = require '../../data/wwperson.json'
# Form = require 'timbuctoo-edit-forms/src/coffee/views/form.coffee'
# {createTimbuctooSchema}  = require 'timbuctoo-edit-forms/src/coffee/helpers.coffee'

Person = require './models/person.coffee'
PersonView = require './views/person.coffee'
PersonOverview = require './views/person-overview.coffee'

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
			new PersonView el: '#view', model: person

	render: ->
		wrapper = $('<div/>').attr(class: 'body-wrap').append @$el.html()
		html = $ @template()
		@$el.html(wrapper)
			.append(html.hide())
			.find('.body-wrap')
			.fadeOut 150, => 
				@$('.body-wrap').remove()
				html.fadeIn 100
		
		# @$el.fadeOut 150, => @$el.html(@template()).fadeIn 50

		# xhr = $.getJSON config.personURL 'PERS000000014854'
		# xhr.done (data) =>
		# 	# schema = createTimbuctooSchema personDescription
		# 	schema = {}
		# 	schema[key] = 'Text' for key, val of personDescription when not key.match /^\^/
		# 	console.log schema
		# 	form = new Form
		# 		model: new Backbone.Model data
		# 		schema: schema
		# 	@$('#view').html form.el

module.exports = App