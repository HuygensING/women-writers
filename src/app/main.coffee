Backbone = require 'backbone'
$ = Backbone.$ = require 'jquery'

config = require './config.coffee'
user = require './models/user'

App = require './app.coffee'
MainRouter = require './routers/main.coffee'

PersonsCollection = require './collections/persons.coffee'
DocumentsCollection = require './collections/documents.coffee'

loadEditData = require './helpers/load-edit-data'
loadAppData  = require './helpers/load-app-data'

{searchQuery} = require './helpers/search'

handleLinkClicks = (e) ->
	href = $(@).attr 'href'	
	if href?
		e.preventDefault()
		href = href.replace config.get('baseUrl'), '' if href.match /^https?:/
		Backbone.history.navigate href, trigger: true

$ ->
	$(document).on 'click', 'a:not([target])', handleLinkClicks

	# Check/set security token
	hasHsId = new RegExp /(?:\?|&)hsid=([^&]+)(?:&.+)?$/
	hsid = hasHsId.exec window.location.href
	if hsid
		config.set authToken: hsid[1]
		window.history.replaceState? {}, '', window.location.href.replace /\?.*$/, ''

	loadAppData().done ->
		user.fetch(login: false).always ->
			startApp = ->
				# All systems go!
				app = new App el: 'body'

				base = config.get('baseUrl').replace /^https?:\/\/[^\/]+/, ''
				mainRouter = new MainRouter
					controller: app
					root: base

				mainRouter.on 'route', (route) => app.updateNavBar route
				config.set 'router', mainRouter
				mainRouter.start()
			
			# If user is logged in, chances are they will want to edit stuff,
			# so we need to load a bunch of data used to populate and manage
			# forms with. See helpers/loadEditData.coffee
			if user.isLoggedIn() and user.isVerified()
				loadEditData().done -> startApp()
			else
				startApp()