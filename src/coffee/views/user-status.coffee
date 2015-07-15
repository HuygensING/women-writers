Backbone = require 'backbone'
$ = require 'jquery'
LoginComponent = require 'hibb-login'

tpl = require '../../jade/views/user-status.jade'

class UserStatus extends Backbone.View
	events:
		'click a.login': '_showLoginModal'

	initialize: ->
		user = LoginComponent.getUser()

		# Re-render the status when the user is unauthorized (after reload).
		@listenTo user, 'unauthorized', =>
			@render()

		# Re-render the status after the user's data (and thus the user's name)
		# has been fetched.
		@listenTo user, 'data-fetched', =>
			@render()

		@render()

	_showLoginModal: ->
		LoginComponent.getLoginView
			title: "Login"
			modal: true

	render: ->
		user = LoginComponent.getUser()

		@$el.html tpl username: user.get('commonName')
		@$el.toggleClass 'logged-in', user.isLoggedIn()

module.exports = UserStatus