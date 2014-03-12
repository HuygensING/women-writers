Backbone = require 'backbone'

config = require '../config.coffee'

workDescription = require '../../data/wwdocument.json'
Form = require 'timbuctoo-edit-forms/src/coffee/views/form.coffee'
{createTimbuctooSchema}  = require 'timbuctoo-edit-forms/src/coffee/helpers.coffee'

class Work extends Backbone.View
	className: 'work-edit'
	template: require '../../templates/views/work.jade'

	initialize: ->
		@render() if @model?
		
	render: ->
		@$el.html @template()
		schema = {}
		
		schema[key] = 'Text' for key, val of workDescription when not key.match /^\^/

		tempFields = (key for key, val of schema when key.match /^temp/)
		nonTempFields = (key for key, val of schema when not key.match /^temp/)

		form = new Form
			className: 'timbuctoo-form'
			model: @model
			schema: schema
			fieldsets: [
				{ 
					fields: nonTempFields,
					legend: ''
				},
				{
					fields: tempFields,
					legend: 'Temporary Fields'
				}
			]

		@$('.form').html form.el

module.exports = Work