Backbone = require 'backbone'
$ = require 'jquery'

baseTemplate = require '../../templates/views/base.jade'
config = require '../models/config.coffee'

Form = require 'edit-forms/src/views/form.coffee'

module.exports = class AppView extends Backbone.View
	template: baseTemplate
	initialize: ->
		@render()

	render: ->
		@$el.html @template()

		$.getJSON config.personURL 'PERS000000015846'