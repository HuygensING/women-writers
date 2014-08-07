Backbone = require 'backbone'
_ = require 'underscore'
$ = Backbone.$

config = require '../../config'

receptionTypes = {}

class ReceptionTypeSelector extends Backbone.View
	template: require '../../../templates/views/reception/type-selector.jade'

	events:
		'click li': 'clickType'

	clickType: (e) ->
		target = $ e.currentTarget
		type  = target.attr 'data-type'

		target.toggleClass 'selected'

		if target.hasClass 'selected'
			@trigger 'select', type
		else
			@trigger 'deselect', type

	initialize: (@options={}) ->
		_.extend @, Backbone.Events
		@render()

	hide: -> @$el.addClass 'hidden'
	show: -> @$el.removeClass 'hidden'

	render: ->
		@$el.html @template
			documentReceptions: config.documentReceptions()
			personReceptions: config.personReceptions()

module.exports = ReceptionTypeSelector