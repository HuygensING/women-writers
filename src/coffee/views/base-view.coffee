Backbone = require 'backbone'
LoginComponent = require 'hibb-login'

niceify = (str) ->
	String(str).replace(/([A-Z](?![A-Z]))/g, ' $1')
			.replace /^./, (s) -> s.toUpperCase()

slugify = (str="") ->
	String(str).replace(/([A-Z](?![A-Z]))/g, '-$1').toLowerCase()

class BaseView extends Backbone.View
	tagName: 'div'

	fieldsetTemplate: require '../../jade/views/base-fieldset.jade'
	fieldTemplate: require '../../jade/views/base-field.jade'

	events:
		'click .controls .delete': 'deleteRecord'

	initialize: (options={}) ->
		{@config, @showingRevision} = options

		@config ?= require '../config'

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

	deleteRecord: ->
		btn = @$('.controls .delete')

		if btn.hasClass 'confirm'
			@model.destroy
				beforeSend: (xhr) =>
					xhr.setRequestHeader 'Authorization', LoginComponent.getUser().getToken()
					xhr.setRequestHeader 'VRE_ID', @config.get 'VRE_ID'
			.success =>
				console.log "OMG"
				# TODO: Do something here, like refetch model.
			.fail =>
				alert "Could not delete record"
				btn.removeClass 'confirm'
				btn.removeClass 'red'
				btn.addClass 'gray'
				btn.removeClass 'alert'
		else
			btn.toggleClass 'confirm'
			btn.toggleClass 'red'
			btn.toggleClass 'gray'
			btn.addClass 'alert'

	showControls: (toggle) ->
		# show = @user.get('loggedIn') and @user.isVerified()
		@$controls?.toggle LoginComponent.getUser().isLoggedIn()

	_processField: (field) ->
		field.html = @_fieldHtml field
		field

	_processFieldset: (fieldset) ->
		values = {}

		for field, idx in fieldset.fields
			matcher = if field.field? then field.field else field
			store = if field.in? then @model.get(field.in) else @model.attributes

			maybeMap = (v) => if field.map? then field.map(v, @model) else v

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

		noValues = 0
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

			noValues++ if field.html.match /no-value/

		fieldset.empty = true if noValues is fieldset.fields.length
		@fieldsetTemplate fieldset: fieldset

	renderFieldsets: ->
		@$fieldsets.empty()

		for fieldset in (@fieldsets ? [])
			if  fieldset.showOnlyWhenLoggedIn and not LoginComponent.getUser().isLoggedIn()
				continue

			html = @_fieldsetHtml fieldset
			@$fieldsets.append html

	render: ->
		hasPid = @model.get('^pid')?
		isDeleted = @model.get '^deleted'
		canEdit = hasPid and not isDeleted

		# Show current position of document/person in result set
		resultIds = @config.get('currentResultIds') or []
		resultIndex = resultIds.indexOf @model.id
		if resultIndex > -1
			prevIdx = resultIndex - 1 if resultIndex - 1 >= 0
			prevId  = resultIds[prevIdx] if prevIdx > -1
			nextIdx = resultIndex + 1 if resultIndex + 1 < resultIds.length
			nextId  = resultIds[nextIdx] if nextIdx

		@$el.html @template
			data: @model.attributes
			modified: @model.get '^modified'
			canEdit: hasPid
			isDeleted: isDeleted
			showingRevision: @showingRevision
			componentsToName: @config.componentsToName
			config: @config
			nextId: nextId
			prevId: prevId
			resultIndex: resultIndex + 1 # only for display purposes
			resultTotal: resultIds.length
			versions: []
			revisions: []
			receptions: @getReceptions()

		@$controls = @$('.controls')
		@showControls()

		@$fieldsets = @$('.fieldsets')
		@renderFieldsets()

module.exports = BaseView