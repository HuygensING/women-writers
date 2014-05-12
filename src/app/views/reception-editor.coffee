Backbone = require 'backbone'

class ReceptionEditor extends Backbone.View
	template: require '../../templates/views/reception-editor.jade'
	className: 'reception-editor'
		
	events:
		'click .close-button' : 'hide'
	
	render: ->
		@$el.html(@template())
		
	show: ->
		@$el.show()
		
	hide: ->
		@$el.hide()
	
module.exports = ReceptionEditor