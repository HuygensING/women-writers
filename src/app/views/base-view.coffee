config = require '../config'
user = require '../models/user'

Backbone = require 'backbone'

class BaseView extends Backbone.View
	fieldsetTemplate: require '../../templates/views/base-fieldset.jade'

	initialize: (options={}) ->
		@listenTo user, 'change:loggedIn', => @showControls()
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
		@$controls?.toggle user.get 'loggedIn'

	renderFieldsets: ->
		for fs in @fieldsets
			data = fields: []

			for field in fs.fields
				if _.isRegExp field
					for f in _.filter(@model.keys(), (k) -> k.match field)
						data.fields.push
							label: f
							value: @model.get f
				else if field.match /^@[^.]+\./ # @relations.isCreatedBy/id=displayName
					[key, type, link, label] = field.split /[.\/=]/

					group = []

					if @model.has(key) and @model.get(key)[type]?
						for r in @model.get(key)[type]
							console.log "Pushing", r, label, link
							group.push
								label: r[label]
								link: r[link]

					data.fields.push
						label: type
						value: group

				else
					data.fields.push
						label: field
						value: @model.get field

			data.title = fs.title if fs.title

			@$('.fieldsets').append @fieldsetTemplate data

	render: ->
		@$el.html @template
			data: @model.attributes
			config: config
			versions: []
			revisions: []
			receptions: @getReceptions()

		@$controls = @$('.controls')
		@showControls()

		@$fieldsets = @$('.fieldsets')
		@renderFieldsets()

module.exports = BaseView