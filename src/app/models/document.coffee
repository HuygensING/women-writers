Backbone = require 'backbone'

config = require '../config.coffee'

class Document extends Backbone.Model
	idAttribute: '_id'
	urlRoot: config.allDocumentsUrl()

	defaults: ->
		'@relations': {}
		'@type': 'wwdocument'

module.exports = Document