Backbone = require 'backbone'

niceify = (str) ->
	String(str).replace(/([A-Z](?![A-Z]))/g, ' $1')
			.replace /^./, (s) -> s.toUpperCase()

slugify = (str="") ->
	String(str).replace(/([A-Z](?![A-Z]))/g, '-$1').toLowerCase()

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

	_processField: (field) ->
		field.html = @_fieldHtml field
		field

	_processFieldset: (fieldset) ->
		values = {}

		for field, idx in fieldset.fields
			matcher = if field.field? then field.field else field
			store = if field.in? then @model.get(field.in) else @model.attributes

			maybeMap = (v) -> if field.map? then field.map(v) else v

			if _.isRegExp matcher # multiple fields, so go through each one
				for subfield, val of store
					if subfield.match matcher
						values[subfield] = maybeMap val
			else # if matcher of store
				values[matcher] = maybeMap store[matcher]

		# Expand regex into separate fields
		for field, idx in fieldset.fields
			matcher = if _.isRegExp field
				field
			else if _.isRegExp field.field
				field.field
			
			continue if not matcher

			matchingFields = for m in _.keys(values) when m.match matcher
				newField = if field.field? then _.clone field else {}
				newField.field = m
				newField.value = values[m]
				newField

			fieldset.fields.splice idx, 1, matchingFields...

		values

	_fieldHtml: (field) ->
		html = ""

		value = field.value

		data = _.extend _.clone(field),
			title: if field.title? then niceify(field.title) else field.field
			value: value 

		# if _.isArray(value)
		# 	value = (field.options.map el for el in value)
		
		if field.formatNewlines is true
			value = String(value ? '').replace /\n/g, '<br>'

		data.classes = [ "field-" + slugify data.field ]
		data.classes.push 'new-line' if data.newLine
		data.classes.push 'large' if data.large
		
		noValue = data.value is '' or
			data.value is undefined or
			(_.isArray(data.value) and data.value.length is 0) or
			not data.value?
		data.classes.push 'no-value' if noValue

		html = @fieldTemplate field: data
		html

	_fieldsetHtml: (fieldset) ->
		data = @_processFieldset fieldset

		for field, idx in fieldset.fields
			# Optionally allow just plain strings as field definitions,
			# but rework into object for further processing
			if _.isString field
				field =
					title: field
					field: field
					type: 'Text'
					value: data[field]
			else
				field.value = data[field.field]

			field.html = @_fieldHtml field
			fieldset.fields[idx] = field

		@fieldsetTemplate fieldset: fieldset

	renderFieldsets: ->
		@$fieldsets.empty()

		for fieldset in (@fieldsets ? [])
			if  fieldset.showOnlyWhenLoggedIn and not @user.isLoggedIn()
				continue

			html = @_fieldsetHtml fieldset
			@$fieldsets.append html

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



	# renderFieldsets: ->
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
