Backbone = require 'backbone'

SearchCreatorWrapper = require '../helpers/search-creator-wrapper'

class ReceptionDocumentSearch extends Backbone.View
	template: require '../../templates/views/reception-faceted-search.jade'
	className: 'reception-editor'
		
	
		
	events:
		'click .close-button' : 'hide'
		
	initialize: (options = {}) ->
		@searchCreatorWrapper = options.searchCreatorWrapper ? new SearchCreatorWrapper()
		
		@queryOptions =
			term: '*'
			resultRows: 0
		@facetNameMap =
			dynamic_s_date: 'Date'
			dynamic_s_origin: 'Origin'
			dynamic_s_document_type: 'Document Type'
			dynamic_s_creator: 'Creator'
			dynamic_s_language: 'Language'
			dynamic_s_subject: 'Subject'
			dynamic_s_genre: 'Genre'
		
		@search = @searchCreatorWrapper.createDocumentFacetedSearch(@queryOptions, @facetNameMap)
		
	render: (parentElement) ->
		@$el.html(@template())
		@$el.append(@search.$el)
		
		parentElement.append(@$el)
		
	show: ->
		@$el.show()
		
	hide: ->
		@$el.hide()
	
module.exports = ReceptionDocumentSearch