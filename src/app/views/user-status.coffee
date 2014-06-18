Backbone = require 'backbone'

class UserStatus extends Backbone.View
	template: require '../../templates/views/user-status.jade'
	events:
		'click a.login': 'login'

	initialize: ->
		@listenTo @model, 'change', => @render()
		@render()

	login: ->
		@showLoader()
		@model.login window.location.href

	showLoader: ->
		@$('.login').fadeOut 150, => @$('.loader').fadeIn 150

	render: ->
		@$el.html(@template @model.attributes)
		.toggleClass 'logged-in', @model.get('_id')?

module.exports = UserStatus