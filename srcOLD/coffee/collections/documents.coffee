Backbone = require 'backbone'

Document = require '../models/document.coffee'

class Documents extends Backbone.Collection
	model: Document

module.exports = Documents