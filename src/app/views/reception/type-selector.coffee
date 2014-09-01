Backbone = require 'backbone'
_ = require 'underscore'
$ = Backbone.$

config = require '../../config'

receptionTypes = {}

class ReceptionTypeSelector extends Backbone.View
	template: require '../../../templates/views/reception/type-selector.jade'

	selection:
		category: null # reception type: work or person
		types: []

	events:
		'click li': 'clickType'

	clickType: (e) ->
		$target = $ e.currentTarget
		type  = $target.attr 'data-type'
		
		$category = $target.closest('.category')
		category = $category.attr 'data-category'

		if category isnt @selection.category
			# We've switched categories, so reset all selections
			@selection.types = []

			# Toggle the active state, to show which reception
			# type we've selected
			$category.siblings('.category').removeClass 'active'
			$category.addClass 'active'

			# clear all selections
			@$('li').removeClass 'selected'
			@selection.category = category

		$target.toggleClass 'selected'

		selectedTypes = $category.find('li.selected')
		@selection.types = selectedTypes.map(->
			name: @getAttribute 'data-type'
			id: @getAttribute 'data-type-id'
		).get()

		@trigger 'change', @selection

	initialize: (@options={}) ->
		_.extend @, Backbone.Events
		@render()

	hide: -> @$el.addClass 'hidden'
	show: -> @$el.removeClass 'hidden'

	render: ->
		@$el.html @template
			config: config
			documentReceptions: config.documentReceptions()
			personReceptions: config.personReceptions()

module.exports = ReceptionTypeSelector