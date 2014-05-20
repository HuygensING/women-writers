config = require '../config.coffee'

class DocumentView extends Backbone.View
	className: 'document view'
	template: require '../../templates/views/document-view.jade'

	initialize: ->
		@fields = (f for f of @model.attributes)
		@render()

	getReceptions: ->
		receptions = config.get 'receptions'
		relations = @model.get '@relations'

		isReception = (r) ->
			for rel in receptions
				if r is rel.regularName or r is rel.inverseName
					return true

			false

		results = (rel for relName, rel of relations when isReception relName)

		results

	render: ->
		console.log "Receptions", @getReceptions()
		@$el.html @template
			document: @model.attributes
			fields: @fields
			receptions: @getReceptions()
			revisions: []
			versions: [
				'foo'
				'bar'
			]

module.exports = DocumentView