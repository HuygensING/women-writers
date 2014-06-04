Backbone = require 'backbone'

class BusyOverlay extends Backbone.View
	template: require '../../templates/views/busy-overlay.jade'
	className: 'busy-overlay'
	
	show: () ->
		console.log 'show', @$el
		@$el.show()
		
	hide: () ->
		@$el.hide()
		
	render: (parentElement) ->
		
		console.log('parentElement', parentElement)
		
		@$el.html(@template())
		
		parentElement.append(@$el)
	
module.exports = BusyOverlay