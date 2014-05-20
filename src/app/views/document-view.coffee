config = require '../config.coffee'

class DocumentView extends Backbone.View
	className: 'document view'
	template: require '../../templates/views/document-view.jade'

	initialize: (options={}) ->
		@fields = [
			'title'
			'description'
			'edition'
			'date'
			'documentType'
			'links'
			'reference'
			'notes'
			'topoi'
			'^pid'
		]

		@fields.push f for f of @model.attributes when f.match /^temp/

		@render()

	getReceptions: ->
		receptions = config.get 'receptions'
		relations = @model.get '@relations'

		isReception = (r) ->
			for rel in receptions
				if r is rel.regularName or r is rel.inverseName
					return true

			false

		results = {}
		for relType in _.keys(relations) when isReception relType
			results[relType] = relations[relType]

		results

	render: ->
		@$el.html @template
			config: config
			document: @model.attributes
			fields: @fields
			receptions: @getReceptions()
			revisions: []
			versions: [
				'foo'
				'bar'
			]

module.exports = DocumentView