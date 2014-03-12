Backbone = require 'backbone'
config = require '../config'

class User extends Backbone.Model
	defaults:
		loggedIn: false
	url: config.userInfoUrl()
	loginUrl: config.get 'userLoginUrl'
	VRE_ID: config.get 'VRE_ID'

	login: (returnUrl) ->
		@fetch(login: true, returnUrl: returnUrl).done =>
			@set loggedIn: true

	logout: ->
		@clear()
		@set loggedIn: false

	fetch: (options={}) ->
		options.headers ?= {}
		options.returnUrl ?= config.get 'baseUrl'
		options.headers.VRE_ID = @VRE_ID
		options.headers.Authorization = config.get 'authToken'

		super _.extend options,
			error: (me, req) =>
				if options.login is true and req.status is 401
					form = Backbone.$('<form>').attr
						method: 'post'
						action: @loginUrl
					form.append Backbone.$('<input>').attr
						type: 'hidden'
						name: 'hsurl'
						value: options.returnUrl
					form.submit()
				else
					try
						console.error "Login failed", req
					catch e
						alert "Could not log you in"

module.exports = new User()