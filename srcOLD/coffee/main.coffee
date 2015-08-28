Backbone = require 'backbone'
$ = Backbone.$ = require 'jquery'

config = require './config'

App = require './app'
MainRouter = require './routers/main'

loadEditData = require './helpers/load-edit-data'
loadAppData  = require('./helpers/load-app-data').loadAll

LoginComponent = require 'hibb-login'
LoginComponent.init
	basic:
		url: "#{config.get('facetedSearchBaseUrl')}/authenticate"
	federated:
		url: config.get('federatedLoginUrl')
LoginComponent.createUser
	tokenPrefix: config.get('tokenPrefix')
	url: -> "#{config.get('baseUrl')}#{config.get('userInfoPath')}"
	headers:
		VRE_ID: 'WomenWriters'

{searchQuery} = require './helpers/search'

handleLinkClicks = (e) ->
	href = $(@).attr 'href'
	if href?
		e.preventDefault()
		href = href.replace config.get('baseUrl'), '' if href.match /^https?:/
		Backbone.history.navigate href, trigger: true

startApp = ->
	app = new App()
	$('body').append app.el

	mainRouter = new MainRouter
		controller: app
		root: 'womenwriters'

	mainRouter.on 'route', (route) => app.updateNavBar route
	config.set 'router', mainRouter
	mainRouter.start()

$ ->
	$(document).on 'click', 'a:not([target])', handleLinkClicks

	LoginComponent.getUser().authorize()

	loadAppData().done ->
		loadEditData().done ->

			startApp()

	# loadAppData().always -> console.log arguments