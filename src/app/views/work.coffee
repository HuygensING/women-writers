Backbone = require 'backbone'

config = require '../config.coffee'

workDescription = require '../../data/metadata/wwdocument.json'
Form = require 'timbuctoo-edit-forms/src/coffee/views/form.coffee'
{createTimbuctooSchema}  = require 'timbuctoo-edit-forms/src/coffee/helpers.coffee'

class Work extends Backbone.View
	className: 'work-edit'
	template: require '../../templates/views/work.jade'

	initialize: ->
		@render() if @model?
		
	render: ->
		@$el.html @template work: @model.attributes
		schema = createTimbuctooSchema workDescription,
			exclude: [
				/^[_@^]/
				'DELETED'
				'ID'
				'PID'
				'ROLES'
				'VARIATIONS'
				'names'
			]
			readonly: [ /^temp/	]

		@form = new Form
			className: 'timbuctoo-form'
			authToken: config.get 'authToken'
			VRE_ID: config.get 'VRE_ID'
			model: @model
			schema: schema

		@$('.form').html @form.el

module.exports = Work