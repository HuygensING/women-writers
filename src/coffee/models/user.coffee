Backbone = require 'backbone'
config = require '../config'

LoginComponent = require 'hibb-login'

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

	isLoggedIn: -> @get 'loggedIn'

	isVerified: ->
		roles = @get('vreAuthorization')?.roles
		if roles?.length
			roles.indexOf('UNVERIFIED_USER') is -1
		else
			false

	checkLoggedIn: -> @fetch login: false

	fetch: (options={}) ->
		options.headers ?= {}
		options.returnUrl ?= config.get 'baseUrl'
		options.headers.VRE_ID = @VRE_ID
		options.headers.Authorization = LoginComponent.getUser().getToken()

		checkLoggedIn = _.extend options,
			error: (me, req) =>
				if options.login is true and req.status is 401
					form = Backbone.$('<form>').attr
						method: 'post'
						action: @loginUrl
					form.append Backbone.$('<input>').attr
						type: 'hidden'
						name: 'hsurl'
						value: options.returnUrl
					Backbone.$("body").append form
					form.submit()
				else
					console?.error "Not logged in", req
		
		super(checkLoggedIn).done (data) =>
			@set loggedIn: true if data._id?

module.exports = new User()