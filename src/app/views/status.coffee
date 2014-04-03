Backbone = require 'backbone'
_ = require 'underscore'
$ = Backbone.$

statusTemplate = require '../../templates/views/status.jade'

class Status extends Backbone.View
	template: statusTemplate
	className: 'status-indicator'

	events:
		'click button.btn': 'done'

	initialize: (@options={}) ->

		{@template} = @options if @options.template?

		@render()

	setStatus: (status) ->
		for cls in @$el.attr('class').split /\s+/ when cls.match /^status-(?!indicator)/
			@$el.removeClass cls
		@$el.addClass "status-#{status}"

	error: (message) ->
		@setStatus 'error'
		@show()

	success: (message, wait=500) ->
		@setStatus 'success'

		showStatusWindow = => @show()
		_.delay showStatusWindow, 250
		closeStatusWindow = => @done()
		_.delay closeStatusWindow, 250 + wait

	loading: ->
		@setStatus 'loading'

	done: (e) ->
		@$el.fadeOut 150, => @$el.remove()

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