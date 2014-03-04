Backbone = require 'backbone'

baseTemplate = require '../../templates/views/base.jade'

Config = require '../models/config.coffee'

module.exports = class AppView extends Backbone.View
	template: baseTemplate
	initialize: ->
		@render()
		console.log new Config

	render: ->
		@$el.html @template()