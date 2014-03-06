Backbone = require 'backbone'

Person = require '../models/person.coffee'

class Persons extends Backbone.Collection
	model: Person

module.exports = Persons