Backbone = require 'backbone'

niceify = (str) ->
	str.replace(/([A-Z](?![A-Z]))/g, ' $1')
			.replace /^./, (s) -> s.toUpperCase()

slugify = (str="") ->
	str.replace(/([A-Z](?![A-Z]))/g, '-$1').toLowerCase()

class BaseView extends Backbone.View
	tagName: 'div'

	fieldsetTemplate: require '../../templates/views/base-fieldset.jade'
	fieldTemplate: require '../../templates/views/base-field.jade'

	initialize: (options={}) ->
		{@config, @user} = options

		@config ?= require '../config'
		@user ?= require '../models/user'

		@listenTo @user, 'change:loggedIn', => @showControls()
		@render()

	isReception: (r) ->
		receptions = @config.get 'receptions'
		for rel in (receptions || [])
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
		@$controls?.toggle @user.get 'loggedIn'

	_processFieldset: (fieldset) ->
		for field, idx in fieldset.fields
			if _.isRegExp field # multiple fields, so go through each one
				if field.in?
					if @model.has field.in
						matching = for subfield, val of @model.get(field.in) when f.match field
							subfield
					console.log "MATCHJING", matching
				else
					matching = (f for f in @model.keys() when f.match field )
				
				fieldset.fields.splice idx, 1, matching...

			# else if field.field? and field.field.match /^@[^.]+\./ # @relations.isCreatedBy
			# 	console.log "KEY", key
			# 	if @model.has key
			# 		console.log "HOLA", @model.get key
					# matching = (f for f in @model.keys() when f.match field )
			# 	[key, relationType, link, label] = field.field.split /[.\/=]/

			# 	allNonReceptions = true if relationType is '*'

			# 	if allNonReceptions
			# 		for typeName, relationType of @model.get key
			# 			group = []
			# 			if not @isReception typeName
			# 				for r in relationType
			# 					data.fields.push @_fieldHtml _.extend _.pick(data, ['newLine', 'large']),
			# 						title: typeName
			# 						field: typeName
			# 						value: field.options.map r
			# 	else if @model.has(key) and @model.get(key)[relationType]?
			# 		if field.group
			# 			if field.options?.map?
			# 				values = (field.options.map(r) for r in @model.get(key)[relationType])
			# 			else
			# 				values = (r[label] for r in @model.get(key)[relationType])

			# 			data.fields.push @fieldTemplate _.extend data,
			# 				title: if field.title? then niceify(field.title) else relationType
			# 				value: values
			# 		else
			# 			for r in @model.get(key)[relationType]
			# 				data.fields.push @fieldTemplate _.extend data,
			# 					title: if field.title? then niceify(field.title) else relationType
			# 					value: r[label]


		fieldset

	_fieldHtml: (field) ->
		html = ""

		# Optionally allow just plain strings as field definitions,
		# but rework into object for further processing
		if not field.field?
			field =
				title: field
				field: field
				type: 'Text'

		value = field.value ? @model.get field.field

		if field.type is 'Array'
			value = (field.options.map el for el in value)
		else if field.formatNewlines is true
			value = String(value ? '').replace /\n/g, '<br>'

		data = _.extend _.clone(field),
			title: if field.title? then niceify(field.title) else field.field
			value: value 

		data.classes  = "field-" + slugify data.field
		data.classes += ' new-line' if data.newLine
		data.classes += ' large' if data.large

		html = @fieldTemplate
			field: data

		html

	_fieldsetHtml: (fieldset) ->
		html = ""

		fields = fieldset.fields ? []

		data =
			fields: []
		data.title = fieldset.title if fieldset.title
		@$('.fieldsets').append @fieldsetTemplate fieldset: data

	renderFieldsets: ->
		# for fieldset in (@fieldsets || [])
		# 	continue if fieldset.showOnlyWhenLoggedIn and not @user.isLoggedIn()
		# 	data =
		# 		config: @config
		# 		fields: []

		# 	for field in fieldset.fields
		# 		if _.isRegExp field # multiple fields, so go through each one
		# 			for f in @model.keys() when f.match field
		# 				data.fields.push @_fieldHtml _.extend _.clone(field),
		# 					field: f
		# 					title: f
		# 		else if field.field? and field.field.match /^@[^.]+\./ # @relations.isCreatedBy
		# 			[key, relationType, link, label] = field.field.split /[.\/=]/

		# 			allNonReceptions = true if relationType is '*'

		# 			if allNonReceptions
		# 				for typeName, relationType of @model.get key
		# 					group = []
		# 					if not @isReception typeName
		# 						for r in relationType
		# 							data.fields.push @_fieldHtml _.extend _.pick(data, ['newLine', 'large']),
		# 								title: typeName
		# 								field: typeName
		# 								value: field.options.map r

		# 			else if @model.has(key) and @model.get(key)[relationType]?
		# 				if field.group
		# 					if field.options?.map?
		# 						values = (field.options.map(r) for r in @model.get(key)[relationType])
		# 					else
		# 						values = (r[label] for r in @model.get(key)[relationType])

		# 					data.fields.push @fieldTemplate _.extend data,
		# 						title: if field.title? then niceify(field.title) else relationType
		# 						value: values
		# 				else
		# 					for r in @model.get(key)[relationType]
		# 						data.fields.push @fieldTemplate _.extend data,
		# 							title: if field.title? then niceify(field.title) else relationType
		# 							value: r[label]
		# 		else
		# 			data.fields.push @_fieldHtml field

		# 	data.title = fieldset.title if fieldset.title
		# 	@$('.fieldsets').append @fieldsetTemplate data

	render: ->
		@$el.html @template
			data: @model.attributes
			config: @config
			versions: []
			revisions: []
			receptions: @getReceptions()

		@$controls = @$('.controls')
		@showControls()

		@$fieldsets = @$('.fieldsets')
		@renderFieldsets()

module.exports = BaseView