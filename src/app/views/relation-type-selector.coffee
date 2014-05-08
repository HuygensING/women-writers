Backbone = require 'backbone'

class RelationTypeSelector extends Backbone.View
	template: require '../../templates/views/relation-type-selector.jade'
	
	events: 
		'click .relation-type-selector .close-button':'hide'
		
	initialize: () ->
	
	show: () ->
		@$el.show()
		
	render: () ->
		@$el.html @template()
		@hide()
	
	hide: () ->
		@$el.hide()
		
module.exports = RelationTypeSelector