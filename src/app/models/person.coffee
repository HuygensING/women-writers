Backbone = require 'backbone'

config = require '../config.coffee'

class Person extends Backbone.Model
	idAttribute: '_id'
	urlRoot: config.allPersonsUrl()

	defaults: ->
		'@relations': {}
		'@type': 'wwperson'
		names: []

module.exports = Person