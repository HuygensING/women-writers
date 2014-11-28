Backbone = require 'backbone'

config = require '../../config.coffee'

class DocumentOverview extends Backbone.View
	template: require '../../../jade/views/document/document-overview.jade'
	tagName: 'div'
	className: 'document-overview'
	
	initialize: ->
		@listenTo config, 'change:allDocuments', => @render()
		@render() if config.get('allDocuments')?
		
	render: ->
		documents = config.get('allDocuments')
		@$el.html @template documents: documents.models 
		 
module.exports = DocumentOverview