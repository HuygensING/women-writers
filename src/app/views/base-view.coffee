config = require '../config'
user = require '../models/user'

Backbone = require 'backbone'

class BaseView extends Backbone.View
	initialize: ->
		@listenTo user, 'change:loggedIn', => @showControls()
		@fields = [
			'title'
			'description'
			'edition'
			'date'
			'links'
			'reference'
			'notes'
			'topoi'
			'^pid'
		]

		@fields.push f for f of @model.attributes when f.match /^temp/

		@render()

	getReceptions: ->
		receptions = config.get 'receptions'
		relations = @model.get '@relations'

		isReception = (r) ->
			for rel in receptions
				if r is rel.regularName or r is rel.inverseName
					return true

			false

		results = {}
		for relType in _.keys(relations) when isReception relType
			results[relType] = relations[relType]

		results

	showControls: (toggle) ->
		@$controls.toggle user.get 'loggedIn'

	render: ->
		@$el.html @template
			data: @model.attributes
			config: config
			fields: @fields
			versions: []
			revisions: []
			receptions: []

		@$controls = @$('.controls')
		@showControls()

module.exports = BaseView