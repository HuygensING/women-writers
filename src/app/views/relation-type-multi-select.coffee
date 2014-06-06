Backbone = require 'backbone'
RelationOptionConverter = require '../../../src/app/helpers/relation-type-option-converter'

class RelationTypeMultiSelect extends Backbone.View
	tagName: 'select'
	className: 'selected-relations'
		
	initialize: (options = {}) ->
		@relationOptionConverter = if options.relationOptionConverter then options.relationOptionConverter else new RelationOptionConverter()
		@$el.attr('multiple', 'multiple')
		
	showWithOptions: (relations = []) ->
		@$el.empty()
		
		for relation in relations
			@$el.append(@relationOptionConverter.convert(relation))
		
		@$el.show()
		
	getSelectedRelationTypeIds: () ->
		return @$el.val() ? []
module.exports = RelationTypeMultiSelect