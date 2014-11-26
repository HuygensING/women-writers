Backbone = require 'backbone'

config = require '../config.coffee'

class Person extends Backbone.Model
	idAttribute: '_id'
	urlRoot: config.allPersonsUrl()

module.exports = Person