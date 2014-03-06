Backbone = require 'backbone'

config = require '../config.coffee'

class Work extends Backbone.Model
	idAttribute: '_id'
	urlRoot: config.allWorksUrl()

module.exports = Work