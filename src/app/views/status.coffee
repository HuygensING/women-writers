Backbone = require 'backbone'
_ = require 'underscore'
$ = Backbone.$

statusTemplate = require '../../templates/views/status.jade'

class Status extends Backbone.View
	template: statusTemplate
	className: 'status-indicator'

	waitBeforeClose: 500

	events:
		'click button.btn': 'done'

	initialize: (@options={}) ->

		{@template} = @options if @options.template?
		{@waitBeforeClose} = @options if @options.waitBeforeClose?

		@render()

	setStatus: (status) ->
		for cls in @$el.attr('class').split /\s+/ when cls.match /^status-(?!indicator)/
			@$el.removeClass cls
		@$el.addClass "status-#{status}"

	error: (message) ->
		@setStatus 'error'
		@show()

	success: (callback) ->
		@setStatus 'success'

		showStatusWindow = => @show()
		_.delay showStatusWindow, 250

		closeStatusWindow = => @done callback
		_.delay closeStatusWindow, 250 + @waitBeforeClose

	loading: ->
		@setStatus 'loading'

	done: (callback) ->
		@$el.fadeOut 150, =>
			@$el.remove()
			callback?()

	show: ->
		@$el.fadeIn 150
		@

	hide: ->
		@$el.fadeOut 150
		@

	render: ->
		@$el.html @template()
		@$el.hide()
		$('body').append @el

module.exports = Status