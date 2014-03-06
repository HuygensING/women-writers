Backbone = require 'backbone'

config = require '../config.coffee'

workDescription = require '../../data/wwdocument.json'
Form = require 'timbuctoo-edit-forms/src/coffee/views/form.coffee'
{createTimbuctooSchema}  = require 'timbuctoo-edit-forms/src/coffee/helpers.coffee'

class Work extends Backbone.View
	template: require '../../templates/views/work.jade'
	
	initialize: ->
		@render() if @model?
		
	render: ->
		@$el.html @template()
		schema = {}
		
		schema[key] = 'Text' for key, val of workDescription when not key.match /^\^/
		form = new Form
			model: @model
			schema: schema
			
		@$el.html form.el

module.exports = Work