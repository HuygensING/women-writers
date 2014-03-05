Backbone = require 'backbone'

class Main extends Backbone.Router
	routes:
		'person': -> 'showPersonForm'
		'': -> 'home'

	initialize: ->
		@on 'route', => console.log arguments

	home: ->
		console.log "Hi"

	showPersonForm: ->
		console.log "Person!"

module.exports = Main