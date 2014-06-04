config = require '../config'
user = require '../models/user'

Backbone = require 'backbone'

class BaseView extends Backbone.View
	fieldsetTemplate: require '../../templates/views/base-fieldset.jade'
	fieldTemplate: require '../../templates/views/base-field.jade'

	initialize: (options={}) ->
		@listenTo user, 'change:loggedIn', => @showControls()
		@render()

	isReception: (r) ->
		receptions = config.get 'receptions'
		for rel in receptions
			if r is rel.regularName or r is rel.inverseName
				return true
			false

	getReceptions: ->
		relations = @model.get '@relations'
		results = {}
		for relType in _.keys(relations) when @isReception relType
			results[relType] = relations[relType]

		results

	showControls: (toggle) ->
		@$controls?.toggle user.get 'loggedIn'

	_fieldHtml: (field) ->
		html = ""

		niceify = (str) ->
			str.replace(/([A-Z](?![A-Z]))/g, ' $1')
					.replace /^./, (s) -> s.toUpperCase()

		# Optionally allow just plain strings as field definitions,
		# but rework into object for further processing
		unless _.isObject(field) and field.field?
			field =
				title: field
				field: field
				type: 'Text'

		data = _.clone field

		if _.isRegExp field.field # multiple fields, so go through each one
			for f in @model.keys() when f.match field.field
				html += @_fieldHtml _.extend data,
					field: f
					title: f
					type: field.type
					large: field.large
		else if field.field.match /^@[^.]+\./ # @relations.isCreatedBy
			[key, relationType, link, label] = field.field.split /[.\/=]/

			allNonReceptions = true if relationType is '*'

			if allNonReceptions
				for typeName, relationType of @model.get key
					group = []
					if not @isReception typeName
						for r in relationType
							html += @_fieldHtml _.extend _.pick(data, ['newLine', 'large']),
								title: typeName
								field: typeName
								value: field.options.map r
			else if @model.has(key) and @model.get(key)[relationType]?
				if field.group
					if field.options?.map?
						values = (field.options.map(r) for r in @model.get(key)[relationType])
					else
						values = (r[label] for r in @model.get(key)[relationType])

					html += @fieldTemplate _.extend data,
						title: if field.title? then niceify(field.title) else relationType
						value: values
				else
					for r in @model.get(key)[relationType]
						html += @fieldTemplate _.extend data,
							title: if field.title? then niceify(field.title) else relationType
							value: r[label]
		else
			# value = if field.value?
			# 	field.value
			# else if field.field.match /\./
			# 	[key, subkey] = field.field.split /\./
			# 	@model.get(key)?[subkey]
			# else
			# 	 @model.get field.field
			value = field.value ? @model.get field.field

			if field.type is 'Array'
				value = (field.options.map el for el in value)

			html = @fieldTemplate _.extend data,
				title: if field.title? then niceify(field.title) else field.field
				value: value 

		html

	renderFieldsets: ->
		for fieldset in @fieldsets
			continue if fieldset.showOnlyWhenLoggedIn and not user.isLoggedIn()

			data =
				config: config
				fields: []

			for field in fieldset.fields
				data.fields.push @_fieldHtml field

			data.title = fieldset.title if fieldset.title
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