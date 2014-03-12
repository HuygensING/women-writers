Backbone = require 'backbone'

class UserStatus extends Backbone.View
	template: require '../../templates/views/user-status.jade'
	events:
		'click button.login': 'login'

	initialize: ->
		@listenTo @model, 'change', => @render()
		@model.fetch login: false

		@render()

	login: ->
		@model.login window.location.href

	render: ->
		@$el.html(@template @model.attributes)
		.hide()
		.toggleClass 'logged-in', @model.get('_id')?
		.show()

module.exports = UserStatus