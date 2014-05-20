Backbone = require 'backbone'

config = require '../config.coffee'

class Document extends Backbone.Model
	idAttribute: '_id'
	url: ->
		url = config.allDocumentsUrl() + '/' + @id
		if @get '^rev'
			url += '?rev=' + @get '^rev'
		url

module.exports = Document