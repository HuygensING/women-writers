Backbone = require 'backbone'

class BusyOverlay extends Backbone.View
	template: require '../../templates/views/busy-overlay.jade'
	className: 'busy-overlay'
	
	show: () ->
		@$el.show()
		
	hide: () ->
		@$el.hide()
		
	render: (parentElement) ->
		@$el.html(@template())
		
		parentElement.append(@$el)
	
module.exports = BusyOverlay