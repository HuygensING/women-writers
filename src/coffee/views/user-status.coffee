Backbone = require 'backbone'
$ = require 'jquery'
Modal = require 'hibb-modal'
LoginComponent = require 'hibb-login'

tpl = require '../../jade/views/user-status.jade'

class UserStatus extends Backbone.View
	events:
		'click a.login': '_showLoginModal'

	initialize: ->
		# @listenTo @model, 'change', => @render()
		@render()

	_showLoginModal: ->
		LoginComponent.getLoginView
			title: "Login"
			modal: true
			federatedLogin: true
			basicLogin: true

	render: ->
		user = LoginComponent.getUser()

		@$el.html tpl()
		@$el.toggleClass 'logged-in', user.isLoggedIn()

module.exports = UserStatus