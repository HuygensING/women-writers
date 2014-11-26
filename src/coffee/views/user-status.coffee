Backbone = require 'backbone'
Modal = require 'hibb-modal'

class UserStatus extends Backbone.View
	template: require '../../jade/views/user-status.jade'
	events:
		'click a.login': 'login'

	initialize: ->
		@listenTo @model, 'change', => @render()
		@render()

	login: ->
		modal = new Modal
			title: "My title!"
			html: $('<div />').html('lalala')
			submitValue: 'OK'
		return
		@showLoader()
		@model.login window.location.href

	showLoader: ->
		@$('.login').fadeOut 150, => @$('.loader').fadeIn 150

	render: ->
		@$el.html(@template @model.attributes)
		.toggleClass 'logged-in', @model.get('_id')?

module.exports = UserStatus