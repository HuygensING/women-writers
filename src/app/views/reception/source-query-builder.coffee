Backbone = require 'backbone'

class SourceQueryBuilder extends Backbone.View
	template: require '../../../templates/views/reception/source-query-builder.jade'
	className: 'reception-searcher'
	
	render: (parentElement) ->
		@$el.html(@template())
		
		parentElement.append(@$el)
	
	hide: () ->
		@$el.hide()
		
	show: () ->
		@$el.show()
	
module.exports = SourceQueryBuilder