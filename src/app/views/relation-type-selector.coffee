Backbone = require 'backbone'

class RelationTypeSelector extends Backbone.View
	tagName: 'div'
	template: require '../../templates/views/relation-type-selector.jade'
	initialize: () ->
	
	show: () ->
		@$el.show()
		
	render: () ->
		@$el.html @template()
		@$el.hide()
		
module.exports = RelationTypeSelector