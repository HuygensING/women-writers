Backbone = require 'backbone'
$ = require 'jquery'
Modal = require 'hibb-modal'
LoginComponent = require 'hibb-login'

tpl = require '../../jade/views/user-status.jade'

class UserStatus extends Backbone.View
	events:
		'click a.login': 'login'

	initialize: ->
		@listenTo @model, 'change', => @render()
		@render()

	login: ->
		LoginComponent.getLoginView
			title: "Login"
			modal: true
			federatedLogin: true
			localLogin: true
			
		@showLoader()

	showLoader: ->
		@$('.login').fadeOut 150, => @$('.loader').fadeIn 150

	render: ->
		user = LoginComponent.getUser()

		@$el.html tpl()
		@$el.toggleClass 'logged-in', user.isLoggedIn()

module.exports = UserStatus